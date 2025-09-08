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
    const products = await OrderModel.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.name",
          quantitySold: { $sum: "$products.quantity" },
          revenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } },
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
