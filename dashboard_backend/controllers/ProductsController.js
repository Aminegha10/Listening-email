import OrderModel from "../models/OrderModel.js";
import logger from "../utils/Logger.js";

const GetTopProducts = async (req, res) => {
  try {
    const { filter, timeRange } = req.query;

    if (!filter || !["revenue", "unitsSold", "ordersCount"].includes(filter)) {
      return res.status(400).json({
        message: "Invalid filter. Use 'revenue', 'unitsSold' or 'ordersCount'.",
      });
    }

    let sortField, projectFields;
    if (filter === "revenue") {
      sortField = "revenue";
      projectFields = {
        revenue: {
          $sum: { $multiply: ["$products.price", "$products.quantity"] },
        },
      };
    } else if (filter === "unitsSold") {
      sortField = "unitsSold";
      projectFields = { unitsSold: { $sum: "$products.quantity" } };
    } else if (filter === "ordersCount") {
      sortField = "ordersCount";
      projectFields = { ordersCount: { $sum: 1 } };
    }

    // -------------------------
    // Time range filter
    // -------------------------
    const now = new Date();
    let dateFilter = {};
    switch (timeRange) {
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
    // Top products aggregation
    // -------------------------
    const pipeline = [
      Object.keys(dateFilter).length > 0 ? { $match: dateFilter } : null,
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.name",
          ...projectFields,
        },
      },
      {
        $project: {
          product: "$_id",
          ...Object.keys(projectFields).reduce(
            (acc, key) => ({ ...acc, [key]: 1 }),
            {}
          ),
          _id: 0,
        },
      },
      { $sort: { [sortField]: -1 } },
      { $limit: 10 },
    ].filter(Boolean); // remove null if no date filter

    // -------------------------
    // Total distinct ordered products
    // -------------------------
    const distinctProducts = await OrderModel.aggregate(
      [
        Object.keys(dateFilter).length > 0 ? { $match: dateFilter } : null,
        { $unwind: "$products" },
        { $group: { _id: "$products.name" } },
        { $count: "totalDistinctProducts" },
      ].filter(Boolean)
    );
    const totalDistinctProducts =
      distinctProducts[0]?.totalDistinctProducts || 0;

    // -------------------------
    // Total all ordered products (sum of quantity)
    // -------------------------
    const totalAllProductsAgg = await OrderModel.aggregate(
      [
        Object.keys(dateFilter).length > 0 ? { $match: dateFilter } : null,
        { $unwind: "$products" },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: "$products.quantity" },
          },
        },
      ].filter(Boolean)
    );
    const totalAllProducts = totalAllProductsAgg[0]?.totalQuantity || 0;

    const topProducts = await OrderModel.aggregate(pipeline);

    res.status(200).json({
      topProducts,
      totalDistinctProducts,
      totalAllProducts, 
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const GetProductsDetails = async (req, res) => {
  try {
    const { timeRange, search } = req.query;
    const now = new Date();
    let dateFilter = {};

    // Time range filter
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

    const pipeline = [
      Object.keys(dateFilter).length > 0 ? { $match: dateFilter } : null,
      { $unwind: "$products" },
      ...(search
        ? [
            {
              $match: {
                $or: [{ "products.name": { $regex: search, $options: "i" } }],
              },
            },
          ]
        : []),
      {
        $group: {
          _id: "$products.name",
          quantitySold: { $sum: "$products.quantity" },
          revenue: {
            $sum: { $multiply: ["$products.quantity", "$products.price"] },
          },
          barcode: { $first: "$products.barcode" },
          warehouse: { $first: "$products.warehouse" },
          ordersCount: { $sum: 1 },
          lastOrderedDate: { $max: "$orderDate" },
        },
      },
      {
        $project: {
          _id: 0,
          productName: "$_id",
          quantitySold: 1,
          revenue: 1,
          barcode: { $ifNull: ["$barcode", "N/A"] },
          warehouse: { $toLower: { $ifNull: ["$warehouse", "N/A"] } },
          ordersCount: 1,
          lastOrderedDate: 1,
        },
      },
      { $sort: { quantitySold: -1 } },
    ].filter(Boolean); // Remove null stages

    const products = await OrderModel.aggregate(pipeline);

    logger.info("Fetched product details successfully");
    res.status(200).json(products);
  } catch (error) {
    logger.error(`Failed to fetch all products: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch all products" });
  }
};

export { GetTopProducts, GetProductsDetails };
