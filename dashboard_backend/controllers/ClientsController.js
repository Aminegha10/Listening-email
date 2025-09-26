import logger from "../utils/Logger.js";
import axios from "axios";
import dotenv from "dotenv";
import OrderModel from "../models/OrderModel.js";

// get top clients
const GetClients = async (req, res) => {
  try {
    const { filter, goal } = req.query;
    console.log("req.query:", req.query);

    // const goal = parseInt(req.query.goal);
    console.log("goal", goal);

    let pipeline = [];
    let group = {};
    let needsUnwind = false;
    let sortStage = null;

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
        group = {
          orders: { $addToSet: "$_id" },
        };
        sortStage = { ordersCount: -1 };
        break;

      case "productsQuantity":
        group = {
          productsQuantity: { $sum: "$products.quantity" },
        };
        needsUnwind = true;
        sortStage = { productsQuantity: -1 };
        break;

      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid filter parameter" });
    }

    // Add unwind stage only if needed
    if (needsUnwind) {
      pipeline.push({ $unwind: "$products" });
    }

    // Group by client
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

    // Run aggregation parallel with each other without executing two time with db
    const [topClients, totalClientsAgg] = await Promise.all([
      OrderModel.aggregate(pipeline),
      OrderModel.distinct("client"), // still needed but now run in parallel
    ]);

    const totalClients = totalClientsAgg.length;

    // Progress percentage
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
