import logger from "../utils/Logger.js";
import OrderModel from "../models/OrderModel.js";

// Get top clients or clients table
const GetClients = async (req, res) => {
  try {
    const { filter, goal, timeRange } = req.query;

    let pipeline = [];
    let group = {};
    let needsUnwind = false;
    let sortStage = null;

    // -------------------------
    // 🕒 Time range filter
    // -------------------------
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

      case "currentYear":
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        dateFilter = { createdAt: { $gte: startOfYear, $lte: endOfYear } };
        break;

      case "all":
      default:
        dateFilter = {};
        break;
    }

    // -------------------------
    // 🧮 Grouping logic
    // -------------------------
    switch (filter) {
      case "all":
        needsUnwind = true; // only for productsQuantity
        break;

      case "revenue":
        group = { revenue: { $sum: "$price" } };
        sortStage = { revenue: -1 };
        break;

      case "ordersCount":
        group = { orders: { $addToSet: "$_id" } };
        sortStage = { ordersCount: -1 };
        break;

      case "productsQuantity":
        group = { productsQuantity: { $sum: "$products.quantity" } };
        needsUnwind = true;
        sortStage = { productsQuantity: -1 };
        break;

      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid filter parameter" });
    }

    // -------------------------
    // 🧩 Build aggregation pipeline
    // -------------------------
    if (Object.keys(dateFilter).length > 0) {
      pipeline.push({ $match: dateFilter });
    }

    if (filter === "all") {
      // Step 1: unwind products to sum productsQuantity per order
      pipeline.push({ $unwind: "$products" });

      // Step 2: group by order to get productsQuantity
      pipeline.push({
        $group: {
          _id: "$_id", // order ID
          client: { $first: "$client" },
          price: { $first: "$price" },
          productsQuantity: { $sum: "$products.quantity" },
          createdAt: { $first: "$createdAt" },
        },
      });

      // Step 3: group by client to sum revenue and productsQuantity
      pipeline.push({
        $group: {
          _id: "$client",
          firstOrderDate: { $min: "$createdAt" },
          revenue: { $sum: "$price" },
          orders: { $addToSet: "$_id" },
          productsQuantity: { $sum: "$productsQuantity" },
        },
      });
    } else {
      if (needsUnwind) pipeline.push({ $unwind: "$products" });
      pipeline.push({
        $group: {
          _id: "$client",
          firstOrderDate: { $min: "$createdAt" },
          ...group,
        },
      });
    }

    // -------------------------
    // Projection
    // -------------------------
    pipeline.push({
      $project: {
        clientName: "$_id",
        firstOrderDate: 1,
        revenue: 1,
        ordersCount: { $size: { $ifNull: ["$orders", []] } },
        productsQuantity: 1,
        _id: 0,
      },
    });

    if (sortStage) pipeline.push({ $sort: sortStage });
    if (filter !== "all") pipeline.push({ $limit: 10 });

    // -------------------------
    // 🧾 Execute aggregation
    // -------------------------
    const [topClients, totalClientsAgg] = await Promise.all([
      OrderModel.aggregate(pipeline),
      OrderModel.distinct("client", dateFilter),
    ]);

    // Format result
    const formattedClients = topClients.map((client) => ({
      ...client,
      firstOrderDate: client.firstOrderDate
        ? new Date(client.firstOrderDate).toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : null,
    }));

    const totalClients = totalClientsAgg.length;

    // -------------------------
    // 🧍‍♂️ Truly new clients today
    // -------------------------
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const trulyNewClientsToday = await OrderModel.aggregate([
      { $group: { _id: "$client", firstOrderDate: { $min: "$createdAt" } } },
      { $match: { firstOrderDate: { $gte: startOfToday, $lte: endOfToday } } },
      { $count: "newClientsToday" },
    ]);

    const newClientsCount = trulyNewClientsToday[0]?.newClientsToday || 0;

    // -------------------------
    // 📈 Growth rate vs yesterday
    // -------------------------
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);
    const endOfYesterday = new Date(startOfYesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    const trulyNewClientsYesterday = await OrderModel.aggregate([
      { $group: { _id: "$client", firstOrderDate: { $min: "$createdAt" } } },
      { $match: { firstOrderDate: { $gte: startOfYesterday, $lte: endOfYesterday } } },
      { $count: "newClientsYesterday" },
    ]);

    const yesterdayClientsCount =
      trulyNewClientsYesterday[0]?.newClientsYesterday || 0;

    const growthRate =
      yesterdayClientsCount > 0
        ? (
            ((newClientsCount - yesterdayClientsCount) / yesterdayClientsCount) *
            100
          ).toFixed(2)
        : 0;

    const progress =
      !isNaN(goal) && goal > 0
        ? parseFloat(((totalClients / goal) * 100).toFixed(2))
        : null;

    // -------------------------
    // ✅ Final response
    // -------------------------
    res.status(200).json({
      success: true,
      data: formattedClients,
      newClientsToday: newClientsCount,
      growthRate: parseFloat(growthRate),
      totalClients,
      progress,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { GetClients };
