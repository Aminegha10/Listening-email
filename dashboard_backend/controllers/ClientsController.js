import logger from "../utils/Logger.js";
import axios from "axios";
import dotenv from "dotenv";
import OrderModel from "../models/OrderModel.js";

// get top clients
const GetClients = async (req, res) => {
  try {
    const { filter } = req.query;
    console.log("Filter:", filter);

    let group = {};
    let isRevenue = false;

    if (filter === "all") {
      // Aggregate everything for all data
      group = {
        revenue: {
          $sum: { $multiply: ["$products.price", "$products.quantity"] },
        },
        ordersCount: { $sum: 1 },
        productsQuantity: { $sum: "$products.quantity" },
      };
      isRevenue = false; // not used for sorting here
    } else if (filter === "revenue") {
      isRevenue = true;
      group = {
        revenue: {
          $sum: { $multiply: ["$products.price", "$products.quantity"] },
        },
      };
    } else if (filter === "ordersCount") {
      group = {
        ordersCount: { $sum: 1 },
      };
    } else if (filter == "productsQuantity") {
      group = {
        productsQuantity: { $sum: "$products.quantity" },
      };
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid filter parameter" });
    }

    const topClients = await OrderModel.aggregate([
      // Unwind products only if revenue or productsQuantity is needed
      ...(filter === "all" ||
      filter === "revenue" ||
      filter == "productsQuantity"
        ? [{ $unwind: "$products" }]
        : []),

      // Group by client
      {
        $group: {
          _id: "$client",
          ...group,
        },
      },

      // Project fields
      {
        $project: {
          clientName: "$_id",
          revenue: 1,
          ordersCount: 1,
          productsQuantity: 1,
          _id: 0,
        },
      },

      // Sort by revenue if filter === revenue, else ordersCount, else no sort
      ...(filter === "revenue"
        ? [{ $sort: { revenue: -1 } }]
        : filter === "ordersCount"
        ? [{ $sort: { ordersCount: -1 } }]
        : filter === "productsQuantity"
        ? [{ $sort: { productsQuantity: -1 } }]
        : []),
      ...(filter !== "all" ? [{ $limit: 10 }] : []), // limit only for specific filters
    ]);

    res.status(200).json(topClients);
  } catch (err) {
    logger.error(err); // use logger instead of console
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { GetClients };
