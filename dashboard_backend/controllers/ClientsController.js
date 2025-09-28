import logger from "../utils/Logger.js";
import axios from "axios";
import dotenv from "dotenv";
import OrderModel from "../models/OrderModel.js";

// get top clients
const GetClients = async (req, res) => {
  try {
    const { filter, goal, timeRange } = req.query;

    let pipeline = [];
    let group = {};
    let needsUnwind = false;
    let sortStage = null;

    // -------------------------
    // Time range filter
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
        const day = now.getDay(); // Sunday = 0, Monday = 1
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

    switch (filter) {
      case "all":
        group = {
          revenue: {
            $sum: { $multiply: ["$products.price", "$products.quantity"] },
          },
          orders: { $addToSet: "$_id" },
          productsQuantity: { $sum: "$products.quantity" },
        };
        needsUnwind = true;
        break;

      case "revenue":
        group = {
          revenue: {
            $sum: { $multiply: ["$products.price", "$products.quantity"] },
          },
        };
        needsUnwind = true;
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

    // Apply date filter
    if (Object.keys(dateFilter).length > 0) {
      pipeline.push({ $match: dateFilter });
    }
    if (needsUnwind) pipeline.push({ $unwind: "$products" });

    pipeline.push({
      $group: {
        _id: "$client",
        firstOrderDate: { $min: "$createdAt" }, // Get earliest order date
        ...group,
      },
    });

    pipeline.push({
      $project: {
        clientName: "$_id",
        firstOrderDate: 1, // Include in projection
        revenue: 1,
        ordersCount: { $size: { $ifNull: ["$orders", []] } },
        productsQuantity: 1,
        _id: 0,
      },
    });

    if (sortStage) pipeline.push({ $sort: sortStage });
    if (filter !== "all") pipeline.push({ $limit: 10 });

    const [topClients, totalClientsAgg] = await Promise.all([
      OrderModel.aggregate(pipeline),
      OrderModel.distinct("client", dateFilter),
    ]);

    // Format dates and ensure progress values are correct
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
    // jjnj Truly New Clients Today
    // -------------------------
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Get clients whose first order is today
    const trulyNewClientsToday = await OrderModel.aggregate([
      // Group by client and get the date of their first order
      {
        $group: {
          _id: "$client",
          firstOrderDate: { $min: "$createdAt" },
        },
      },
      // Keep only clients whose first order is today
      {
        $match: {
          firstOrderDate: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      // Count them
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

    // Get clients whose first order was yesterday
    const trulyNewClientsYesterday = await OrderModel.aggregate([
      {
        $group: {
          _id: "$client",
          firstOrderDate: { $min: "$createdAt" },
        },
      },
      {
        $match: {
          firstOrderDate: { $gte: startOfYesterday, $lte: endOfYesterday },
        },
      },
      { $count: "newClientsYesterday" },
    ]);

    const yesterdayClientsCount =
      trulyNewClientsYesterday[0]?.newClientsYesterday || 0;

    const growthRate =
      yesterdayClientsCount > 0
        ? (
            ((newClientsCount - yesterdayClientsCount) /
              yesterdayClientsCount) *
            100
          ).toFixed(2)
        : 0;
    let progress = null;
    if (!isNaN(goal) && goal > 0) {
      progress = ((totalClients / goal) * 100).toFixed(2);
    }

    res.status(200).json({
      success: true,
      data: formattedClients,
      newClientsToday: newClientsCount,
      growthRate: parseFloat(growthRate),
      totalClients,
      progress: progress ? parseFloat(progress) : null,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { GetClients };
