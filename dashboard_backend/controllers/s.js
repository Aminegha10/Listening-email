update this i wanna also agent that sent based also on timerange filter : const GetOrderAndSalesStats = async (req, res) => {
  try {
    const { salesAgent, timeRange } = req.query;
    console.log("a")
    const now = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Total orders
    const totalOrders = await OrderModel.countDocuments();
    // Total sales
    const totalSalesResult = await OrderModel.aggregate([
      { $match: { price: { $ne: null } } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const totalSales = totalSalesResult[0]?.total || 0;

    // Orders per agent
    const agentsAggregate = await OrderModel.aggregate([
      { $match: { ...(salesAgent ? { salesAgent } : {}) } },
      {
        $group: {
          _id: "$salesAgent",
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$price" },
        },
      },
      { $project: { name: "$_id", totalOrders: 1, totalSales: 1, _id: 0 } },
    ]);

    const allAgents = await OrderModel.distinct("salesAgent");

    // Today stats
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayOrders = await OrderModel.countDocuments({
      ...(salesAgent ? { salesAgent } : {}),
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const todaySalesResult = await OrderModel.aggregate([
      {
        $match: {
          ...(salesAgent ? { salesAgent } : {}),
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      { $group: { _id: null, todaySales: { $sum: "$price" } } },
    ]);
    const todaySales = todaySalesResult[0]?.todaySales || 0;

    // =========================
    // Orders & Sales by Time Range
    // =========================
    let ordersData = [];
    let salesData = [];
    let responseKey = "";

    if (timeRange === "thisWeek") {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const day = today.getDay();
      const diffToMonday = day === 0 ? 6 : day - 1;
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      const dateFilter = {
        createdAt: { $gte: startOfWeek, $lte: today },
        ...(salesAgent ? { salesAgent } : {}),
      };

      // Sales
      salesData = await OrderModel.aggregate([
        { $match: dateFilter },
        { $addFields: { dayOfWeek: { $dayOfWeek: "$createdAt" } } },
        { $group: { _id: "$dayOfWeek", sales: { $sum: "$price" } } },
        {
          $project: {
            _id: 0,
            day: {
              $switch: {
                branches: [
                  { case: { $eq: ["$_id", 2] }, then: "Monday" },
                  { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
                  { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
                  { case: { $eq: ["$_id", 5] }, then: "Thursday" },
                  { case: { $eq: ["$_id", 6] }, then: "Friday" },
                  { case: { $eq: ["$_id", 7] }, then: "Saturday" },
                  { case: { $eq: ["$_id", 1] }, then: "Sunday" },
                ],
              },
            },
            sales: 1,
          },
        },
      ]);

      // Orders
      ordersData = await OrderModel.aggregate([
        { $match: dateFilter },
        { $addFields: { dayOfWeek: { $dayOfWeek: "$createdAt" } } },
        { $group: { _id: "$dayOfWeek", orders: { $sum: 1 } } },
        {
          $project: {
            _id: 0,
            day: {
              $switch: {
                branches: [
                  { case: { $eq: ["$_id", 2] }, then: "Monday" },
                  { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
                  { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
                  { case: { $eq: ["$_id", 5] }, then: "Thursday" },
                  { case: { $eq: ["$_id", 6] }, then: "Friday" },
                  { case: { $eq: ["$_id", 7] }, then: "Saturday" },
                  { case: { $eq: ["$_id", 1] }, then: "Sunday" },
                ],
              },
            },
            orders: 1,
          },
        },
      ]);

      const weekDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      salesData = weekDays.map((d) => {
        const found = salesData.find((x) => x.day === d);
        return { day: d, sales: found ? found.sales : 0 };
      });
      ordersData = weekDays.map((d) => {
        const found = ordersData.find((x) => x.day === d);
        return { day: d, orders: found ? found.orders : 0 };
      });

      responseKey = "thisWeek";
    } else if (timeRange === "thisMonth") {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const totalDays = endOfMonth.getDate();
      const totalWeeks = Math.ceil(totalDays / 7);

      // Sales
      salesData = await OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
            ...(salesAgent ? { salesAgent } : {}),
          },
        },
        {
          $addFields: {
            dayDiff: {
              $floor: {
                $divide: [
                  { $subtract: ["$createdAt", startOfMonth] },
                  1000 * 60 * 60 * 24,
                ],
              },
            },
          },
        },
        {
          $addFields: {
            week: { $add: [1, { $floor: { $divide: ["$dayDiff", 7] } }] },
          },
        },
        { $group: { _id: "$week", sales: { $sum: "$price" } } },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            week: { $concat: ["week", { $toString: "$_id" }] },
            sales: 1,
          },
        },
      ]);

      // Orders
      ordersData = await OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
            ...(salesAgent ? { salesAgent } : {}),
          },
        },
        {
          $addFields: {
            dayDiff: {
              $floor: {
                $divide: [
                  { $subtract: ["$createdAt", startOfMonth] },
                  1000 * 60 * 60 * 24,
                ],
              },
            },
          },
        },
        {
          $addFields: {
            week: { $add: [1, { $floor: { $divide: ["$dayDiff", 7] } }] },
          },
        },
        { $group: { _id: "$week", orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            week: { $concat: ["week", { $toString: "$_id" }] },
            orders: 1,
          },
        },
      ]);

      const allWeeks = Array.from(
        { length: totalWeeks },
        (_, i) => `week${i + 1}`
      );
      salesData = allWeeks.map((w) => {
        const found = salesData.find((x) => x.week === w);
        return { week: w, sales: found ? found.sales : 0 };
      });
      ordersData = allWeeks.map((w) => {
        const found = ordersData.find((x) => x.week === w);
        return { week: w, orders: found ? found.orders : 0 };
      });

      responseKey = "thisMonth";
    } else if (timeRange === "currentYear") {
      // Sales
      salesData = await OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(now.getFullYear(), 0, 1) },
            ...(salesAgent ? { salesAgent } : {}),
          },
        },
        {
          $group: { _id: { $month: "$createdAt" }, sales: { $sum: "$price" } },
        },
        { $sort: { _id: 1 } },
      ]);
      salesData = salesData.map((s) => ({
        month: monthNames[s._id - 1],
        sales: s.sales,
      }));

      // Orders
      ordersData = await OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(now.getFullYear(), 0, 1) },
            ...(salesAgent ? { salesAgent } : {}),
          },
        },
        { $group: { _id: { $month: "$createdAt" }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);
      ordersData = ordersData.map((o) => ({
        month: monthNames[o._id - 1],
        orders: o.orders,
      }));

      responseKey = "currentYear";
    }

    res.status(200).json({
      totalSalesToday: todaySales,
      totalOrders,
      todayOrders,
      agents: agentsAggregate,
      allAgents,
      totalSales,
      salesData,
      ordersData,
      responseKey,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Failed to fetch order stats" });
  }
};