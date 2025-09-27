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
        ...group,
      },
    });

    pipeline.push({
      $project: {
        clientName: "$_id",
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

    const totalClients = totalClientsAgg.length;

    let progress = null;
    if (!isNaN(goal) && goal > 0) {
      progress = ((totalClients / goal) * 100).toFixed(2);
    }

    res.status(200).json({
      success: true,
      data: topClients,
      totalClients,
      progress: progress ? parseFloat(progress) : null,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { GetClients };
