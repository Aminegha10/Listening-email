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

    // Fetch lead data
    const { data } = await axios.get(
      `https://smabapi.qalqul.io/api/qalqul-leads/lead/${orderNumber}`,
      { headers: { Authorization: `${process.env.API_TOKEN}` } }
    );

    const lead = { ...data.lead, ...req.body };

    const typedepaiement =
      lead.typedepaiement?.label ?? lead.typedepaiement ?? "unknown";
    const normalizedNotes = Array.isArray(notes)
      ? notes.join("\n")
      : notes || "";
    // is Order completed
    console.log(lead);
    const isCompleted =
      lead.pipelineStage.label === "Confirmation de réception" ? true : false;

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
        isCompleted,
      });

      logger.info(`Order created successfully: ID ${newOrder._id}`);
      return res.send(newOrder);
    } catch (err) {
      if (err.code !== 11000) throw err;
      logger.warn(
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

const GetOrderStats = async (req, res) => {
  try {
    const { salesAgent, timeRange, type } = req.query;

    // 📌 Time range filter
    const now = new Date();
    let dateFilter = {};

    if (timeRange === "last_7") {
      const start = new Date();
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { $gte: start } };
    } else if (timeRange === "last_30") {
      const start = new Date();
      start.setDate(now.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { $gte: start } };
    } else if (timeRange === "ytd") {
      const start = new Date(now.getFullYear(), 0, 1);
      dateFilter = { createdAt: { $gte: start } };
    }

    // ✅ Total orders
    const totalOrders = await OrderModel.countDocuments();

    // ✅ Completed orders
    const totalordersCompleted = await OrderModel.countDocuments({
      isCompleted: true,
    });
    const result = await OrderModel.aggregate([
      { $match: { price: { $ne: null } } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const totalSales = result[0]?.total || 0;

    // ✅ Orders per sales agent
    if (type == "orders") {
      var agentsAggregate = await OrderModel.aggregate([
        { $match: { ...dateFilter, ...(salesAgent ? { salesAgent } : {}) } },
        {
          $group: {
            _id: "$salesAgent",
            totalOrders: { $sum: 1 },
          },
        },
        {
          $project: {
            name: "$_id",
            totalOrders: 1,
            _id: 0,
          },
        },
      ]);
    }
    if (type == "sales") {
      var salesAggregate = await OrderModel.aggregate([
        { $match: { ...dateFilter, ...(salesAgent ? { salesAgent } : {}) } },
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
      ]);
    }
    var agentsAggregate = type == "orders" ? agentsAggregate : salesAggregate;
    // 🔄 Full list of agents (for dropdowns)
    const allAgents = await OrderModel.distinct("salesAgent");

    // ✅ Total orders today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayOrders = await OrderModel.countDocuments({
      ...(salesAgent ? { salesAgent } : {}),
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    // ============================
    // 📤 Send response
    // ============================
    res.status(200).json({
      totalOrders,
      totalordersCompleted,
      todayOrders, // ✅ added
      agents: agentsAggregate,
      allAgents,
      totalSales,
    });
  } catch (error) {
    console.error("Failed to fetch order stats:", error.message);
    res.status(500).json({ error: "Failed to fetch order stats" });
  }
};

const GetRadarStats = async (req, res) => {
  try {
    const { agent } = req.query; // "global" or specific agent

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Base filter
    const baseFilter = agent && agent !== "global" ? { salesAgent: agent } : {};

    // 1️⃣ Monthly aggregation
    const monthlyRaw = await OrderModel.aggregate([
      { $match: { ...baseFilter, createdAt: { $gte: startOfYear } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, agent: "$salesAgent" },
          leads: { $sum: 1 }, // all orders count as leads
          orders: { $sum: { $cond: ["$isCompleted", 1, 0] } }, // only completed
        },
      },
      {
        $project: {
          month: "$_id.month",
          agent: "$_id.agent",
          orders: 1,
          leads: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // 2️⃣ Restructure for front-end
    const monthlyDataByAgent = {};
    monthlyRaw.forEach((d) => {
      const agentName = d.agent || "Unknown Agent";
      if (!monthlyDataByAgent[agentName]) {
        monthlyDataByAgent[agentName] = MONTHS.map((m) => ({
          month: m,
          orders: 0,
          leads: 0,
        }));
      }
      monthlyDataByAgent[agentName][d.month - 1] = {
        month: MONTHS[d.month - 1],
        orders: d.orders,
        leads: d.leads,
      };
    });

    // 3️⃣ Global monthly data (sum across agents)
    const monthlyData = MONTHS.map((m, idx) => {
      let orders = 0,
        leads = 0;
      Object.values(monthlyDataByAgent).forEach((agentArr) => {
        orders += agentArr[idx].orders;
        leads += agentArr[idx].leads;
      });
      return { month: m, orders, leads };
    });

    res.status(200).json({ monthlyData, monthlyDataByAgent });
  } catch (err) {
    console.error("Radar stats error:", err);
    res.status(500).json({ error: "Failed to fetch radar stats" });
  }
};

export { AddOrder, GetOrderStats, GetRadarStats };
