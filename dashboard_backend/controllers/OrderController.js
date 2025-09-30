import logger from "../utils/Logger.js";
import axios from "axios";
import dotenv from "dotenv";
import OrderModel from "../models/OrderModel.js";
dotenv.config();

const AddOrder = async (req, res) => {
  try {
    const {
      orderNumber,
      salesAgent,
      orderDate,
      products = [],
      notes,
    } = req.body;
    console.log("body");

    // Check if any required field is missing or invalid
    if (!orderNumber || !salesAgent || !orderDate || !Array.isArray(products) || products.length === 0 || !notes) {
      return res.status(400).send({
        error: "Missing or invalid required fields.",
        missing: {
          orderNumber: !orderNumber,
          salesAgent: !salesAgent,
          orderDate: !orderDate,
          products: !Array.isArray(products) || products.length === 0,
          notes: !notes,
        },
      });
    }

    // Fetch lead data
    const { data } = await axios.get(
      `https://smabapi.qalqul.io/api/qalqul-leads/lead/${orderNumber}`,
      { headers: { Authorization: `${process.env.API_TOKEN}` } }
    );
    // console.log(data);

    const lead = { ...data.lead, ...req.body };

    const typedepaiement =
      lead.typedepaiement?.label ?? lead.typedepaiement ?? "unknown";
    const normalizedNotes = Array.isArray(notes)
      ? notes.join("\n")
      : notes || "";

    logger.info(
      `Creating or updating order #${orderNumber} with ${products.length} product(s).`
    );

    // Try to create order
    try {
      const newOrder = await OrderModel.create({
        orderNumber,
        client: lead.subject,
        price: lead.prixttc,
        typedepaiement,
        salesAgent,
        orderDate: orderDate ? new Date(orderDate) : null,
        notes: normalizedNotes,
        products,
        // isCompleted,
      });

      logger.info(`Order created successfully: ID ${newOrder._id}`);
      return res.send(newOrder);
    } catch (err) {
      if (err.code !== 11000) throw err;
      logger.error(
        `Duplicate order #${orderNumber} found. Updating existing order...`
      );
    }

    // Update existing order
    const existingOrder = await OrderModel.findOne({ orderNumber });
    if (!existingOrder) {
      logger.error(`Order #${orderNumber} not found.`);
      return;
    }

    // Decide warehouse update (MAG or MED)
    const keepWarehouse = products[0].warehouse === "MAG" ? "MED" : "MAG";
    existingOrder.products = [
      ...existingOrder.products.filter((p) => p.warehouse === keepWarehouse),
      ...products,
    ];

    const neworder = await existingOrder.save();
    logger.info(
      `Updated order #${orderNumber} successfully with ${products[0].warehouse} products.`
    );
    return res.send(neworder);
  } catch (error) {
    logger.error(`Failed to create or update order: ${error.message}`);
  }
};

const GetOrderAndSalesStats = async (req, res) => {
  try {
    const { salesAgent, timeRange } = req.query;
    console.log(salesAgent);
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

    // =========================
    // Global stats (not filtered)
    // =========================
    const totalOrders = await OrderModel.countDocuments();
    const totalSalesResult = await OrderModel.aggregate([
      { $match: { price: { $ne: null } } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const totalSales = totalSalesResult[0]?.total || 0;

    // =========================
    // Orders per agent (global)
    // =========================
    // const agentsAggregate = await OrderModel.aggregate([
    //   { $match: { ...(salesAgent ? { salesAgent } : {}) } },
    //   {
    //     $group: {
    //       _id: "$salesAgent",
    //       totalOrders: { $sum: 1 },
    //       totalSales: { $sum: "$price" },
    //     },
    //   },
    //   { $project: { name: "$_id", totalOrders: 1, totalSales: 1, _id: 0 } },
    // ]);

    const allAgents = await OrderModel.distinct("salesAgent");

    // =========================
    // Today stats
    // =========================
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayOrders = await OrderModel.countDocuments({
      // ...(salesAgent ? { salesAgent } : {}),
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const todaySalesResult = await OrderModel.aggregate([
      {
        $match: {
          // ...(salesAgent ? { salesAgent } : {}),
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
    let agentsByTimeRange = [];
    let responseKey = "";

    let dateFilter = {}; // reusable for agent filtering

    if (timeRange === "thisWeek") {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const day = today.getDay();
      const diffToMonday = day === 0 ? 6 : day - 1;
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      dateFilter = { createdAt: { $gte: startOfWeek, $lte: today } };

      responseKey = "thisWeek";
    } else if (timeRange === "thisMonth") {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      dateFilter = { createdAt: { $gte: startOfMonth, $lte: endOfMonth } };
      responseKey = "thisMonth";
    } else if (timeRange === "currentYear") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      dateFilter = { createdAt: { $gte: startOfYear, $lte: endOfYear } };
      responseKey = "currentYear";
    }

    // Merge salesAgent filter if needed
    if (salesAgent) {
      dateFilter.salesAgent = salesAgent;
    }

    // =========================
    // Totals by time range
    // =========================
    const totalOrdersByTimeRange = await OrderModel.countDocuments(dateFilter);

    const totalSalesByTimeRangeResult = await OrderModel.aggregate([
      { $match: { ...dateFilter, price: { $ne: null } } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const totalSalesByTimeRange = totalSalesByTimeRangeResult[0]?.total || 0;

    // =========================
    // Agent stats by Time Range
    // =========================
    agentsByTimeRange = await OrderModel.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$salesAgent",
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          totalOrders: 1,
          totalSales: 1,
        },
      },
      { $sort: { totalSales: -1 } }, // top performing first
    ]);

    // =========================
    // Build time-based sales/orders (reuses your original logic)
    // =========================
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

    // =========================
    // Final response
    // =========================
    res.status(200).json({
      totalSalesToday: todaySales,
      totalOrders,
      todayOrders,
      totalSales,
      allAgents,
      totalOrdersByTimeRange,
      totalSalesByTimeRange,
      // agents: agentsAggregate,
      agents: agentsByTimeRange, // ✅ NEW
      salesData,
      ordersData,
      responseKey,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch order stats" });
  }
};

const GetOrdersTableStats = async (req, res) => {
  try {
    const { timeRange, search = "" } = req.query;
    const now = new Date();
    let dateFilter = {};

    switch (timeRange) {
      case "today":
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        dateFilter = { createdAt: { $gte: startOfToday, $lte: endOfToday } };
        break;

      case "thisWeek":
        const day = now.getDay();
        const diffToMonday = day === 0 ? 6 : day - 1;
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        dateFilter = { createdAt: { $gte: startOfWeek, $lte: endOfWeek } };
        break;

      case "thisMonth":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        dateFilter = { createdAt: { $gte: startOfMonth, $lte: endOfMonth } };
        break;

      case "all":
      default:
        dateFilter = {};
        break;
    }

    // Build the final query
    const query = {
      ...dateFilter,
      $or: [
        { orderNumber: { $regex: search, $options: "i" } },
        { salesAgent: { $regex: search, $options: "i" } },
        { client: { $regex: search, $options: "i" } },
      ],
    };

    const Orders = await OrderModel.find(
      query,
      "orderNumber salesAgent products client createdAt price typedepaiement"
    ).sort({ createdAt: -1 });

    // Format the orders with proper date
    const formattedOrders = Orders.map(order => ({
      ...order.toObject(),
      createdAt: order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) : null
    }));

    return res.json(formattedOrders);
  } catch (error) {
    logger.error(`Failed to fetch orders: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const GetOrdersByAgents = async (req, res) => {
  try {
    const ordersByAgents = await OrderModel.aggregate([
      {
        $group: {
          _id: "$salesAgent",
          orders: { $sum: 1 },
          sales: { $sum: "$price" },
        },
      },
      {
        $project: {
          salesAgent: "$_id",
          orders: 1,
          sales: 1,
          _id: 0, // optional: hide _id if you don’t want it
        },
      },
      { $sort: { orders: -1 } },
    ]);

    res.status(200).json(ordersByAgents);
  } catch (error) {
    logger.error("Failed to fetch orders by agents:", error.message);
    res.status(500).json({ error: "Failed to fetch orders by agents" });
  }
};

const GetTopSalesAgent = async (req, res) => {
  try {
    // Get all agents with their total sales
    const agentsWithSales = await OrderModel.aggregate([
      {
        $group: {
          _id: "$salesAgent",
          totalSales: { $sum: "$price" },
        },
      },
      {
        $project: {
          name: "$_id",
          totalSales: 1,
          _id: 0,
        },
      },
      { $sort: { totalSales: -1 } },
    ]);

    // Get total number of agents
    const totalAgents = await OrderModel.distinct("salesAgent");
    const totalAgentsCount = totalAgents.length;

    // Get total sales across all agents
    const totalSalesResult = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" },
        },
      },
    ]);
    const totalSalesAll = totalSalesResult[0]?.totalSales || 0;

    // Calculate top agent and percentage
    const topAgent = agentsWithSales[0] || { name: "No Agent", totalSales: 0 };
    const percentage =
      totalSalesAll > 0 ? (topAgent.totalSales / totalSalesAll) * 100 : 0;

    const response = {
      topAgent: {
        name: topAgent.name,
        totalSales: topAgent.totalSales,
        percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
        totalAgents: totalAgentsCount,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error("Failed to fetch top sales agent:", error.message);
    res.status(500).json({ error: "Failed to fetch top sales agent" });
  }
};

export {
  AddOrder,
  GetOrderAndSalesStats,
  GetOrdersTableStats,
  GetOrdersByAgents,
  GetTopSalesAgent,
};
