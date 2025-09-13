import OrderModel from "../models/OrderModel.js";
import logger from "../utils/Logger.js";

const GetTopProducts = async (req, res) => {
  try {
    const topProducts = await OrderModel.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.name",
          totalQuantity: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }, // top 10 products
      {
        $project: {
          product: "$_id",
          quantity: "$totalQuantity",
          _id: 0,
        },
      },
    ]);

    res.status(200).json(topProducts);
  } catch (error) {
    logger.error(`Failed to fetch top products: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch top products" });
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
                $or: [
                  { "products.name": { $regex: search, $options: "i" } },
                ],
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

    res.status(200).json(products);
  } catch (error) {
    logger.error(`Failed to fetch all products: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch all products" });
  }
};

export { GetTopProducts, GetProductsDetails };
