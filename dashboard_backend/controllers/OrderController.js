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
    // console.log(data);

    const lead = { ...data.lead, ...req.body };

    const typedepaiement =
      lead.typedepaiement?.label ?? lead.typedepaiement ?? "unknown";
    const normalizedNotes = Array.isArray(notes)
      ? notes.join("\n")
      : notes || "";
    // logger.log(lead);
    // // is Order completed
    // logger.log(lead);
    // const isCompleted =
    //   lead.pipelineStage.label === "Confirmation de réception" ? true : false;

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
    // const totalordersCompleted = await OrderModel.countDocuments({
    //   isCompleted: true,
    // });
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
    // ✅ Total sales today
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
    // Sales By Month
    const sales = await OrderModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$price" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

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

    const salesByMonth = sales.map((sale) => ({
      month: monthNames[sale._id - 1],
      sales: sale.totalSales,
    }));

    // Orders By Month
    const orders = await OrderModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const ordersByMonth = orders.map((order) => ({
      month: monthNames[order._id - 1],
      orders: order.totalOrders,
    }));

    console.log("a")
    // ============================
    // 📤 Send response
    // ============================
    res.status(200).json({
      totalSalesToday: todaySales,
      totalOrders,
      // totalordersCompleted,
      todayOrders, // ✅ added
      agents: agentsAggregate,
      allAgents,
      totalSales,
      salesByMonth,
      ordersByMonth
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Failed to fetch order stats" });
  }
};

const GetOrdersTableStats = async (req, res) => {
  try {
    const { ordersDate, search = "" } = req.query; // default values
    let dateFilter;

    const now = new Date();

    if (ordersDate === "today") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      dateFilter = { $gte: startOfDay };
    } else if (ordersDate === "last7Days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      dateFilter = { $gte: sevenDaysAgo };
    } else if (ordersDate === "thisMonth") {
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfThisMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      dateFilter = { $gte: startOfThisMonth, $lte: endOfThisMonth };
    }
    // logger.info(dateFilter);

    // Build the final query
    const query = {
      ...(dateFilter && { createdAt: dateFilter }),
      $or: [
        { orderNumber: { $regex: search, $options: "i" } },
        { salesAgent: { $regex: search, $options: "i" } },
        { client: { $regex: search, $options: "i" } },
      ],
    };

    // const numericLimit = parseInt(limit);

    const Orders = await OrderModel.find(
      query,
      "orderNumber salesAgent products client createdAt price typedepaiement"
    );
    // .limit(numericLimit);

    return res.json(Orders);
  } catch (error) {
    // logger.error(error);
    res.status(500).json(error.message);
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
    const percentage = totalSalesAll > 0 ? (topAgent.totalSales / totalSalesAll) * 100 : 0;

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
