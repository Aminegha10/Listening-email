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
    console.log(dateFilter);

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

    const totalOrderedProducts =
      distinctProducts[0]?.totalDistinctProducts || 0;

    const topProducts = await OrderModel.aggregate(pipeline);

    res.status(200).json({
      topProducts,
      totalOrderedProducts,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const GetProductsDetails = async (req, res) => {
  try {
    const { productsDate, search } = req.query; // default values
    let dateFilter;

    const now = new Date();

    if (productsDate === "today") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      dateFilter = { $gte: startOfDay };
    } else if (productsDate === "last7Days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      dateFilter = { $gte: sevenDaysAgo };
    } else if (productsDate === "thisMonth") {
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
    const products = await OrderModel.aggregate([
      { $match: { createdAt: dateFilter } },
      // it give you each product with the other details from the document
      { $unwind: "$products" },
      ...(search
        ? [
            {
              // it gives you the whole document if one product match the search
              $match: {
                $or: [{ "products.name": { $regex: search, $options: "i" } }],
              },
            },
          ]
        : []),
      //
      {
        $group: {
          _id: "$products.name",
          quantitySold: { $sum: "$products.quantity" },
          revenue: {
            $sum: { $multiply: ["$products.quantity", "$products.price"] },
          },
          barcode: { $first: "$products.barcode" },
          warehouse: { $first: "$products.warehouse" },
          ordersCount: { $sum: 1 }, // each order containing the product counts as 1
          lastOrderedDate: { $max: "$orderDate" }, // assuming you have an orderDate field
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
    ]);
    logger.info("Fetched product details successfully");
    res.status(200).json(products);
  } catch (error) {
    logger.error(`Failed to fetch all products: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch all products" });
  }
};

export { GetTopProducts, GetProductsDetails };
