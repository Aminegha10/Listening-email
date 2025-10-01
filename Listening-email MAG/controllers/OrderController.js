import logger from "../utils/Logger.js";
// import OrderModel from "../models/OrderModel.js";
// import { generatePdf } from "../services/EmailPrinting.js";
import axios from "axios";
const addOrder = async (products, orderDetails) => {
  // console.log(orderDetails);
  try {
    const { orderNumber, salesAgent, orderDate, notes } = orderDetails;

    if (!orderNumber || products.length === 0) {
      logger.error("Missing required order fields or product list.");
      return;
    }

    // Validate schema
    const isProductValid = products.every(
      ({ name, quantity, barcode, warehouse }) =>
        Boolean(name && quantity && barcode && warehouse)
    );

    if (!isProductValid) {
      logger.error("Invalid product entry detected. All fields are required.");
      return;
    }

    const res = await axios.post(
      `http://217.65.146.240:5000/api/Lead`,
      {
        orderNumber,
        salesAgent,
        orderDate,
        products,
        notes,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_DASHBOARD}`,
        },
      }
    );
    // const pdfPath = await generatePdf(orderInfo);
    logger.info(
      "MAG email send and order created or updated with MAG Products successfully"
    );
    logger.info(`Order Created/Updated: ${JSON.stringify(res.data, null, 2)}`);
    return;
  } catch (err) {
    logger.error(err.response.data);
    return;
  }
};

export { addOrder };

// await OrderModel.updateOne(
//   { orderNumber },
//   {
//     // Step 1: remove all products with MAG warehouse
//     $pull: { products: { warehouse: "MAG" } },
//     // Step 2: add the new MAG products from email
//     $push: { products: { $each: products } },
//     // Optional: update other order fields
//     $set: {
//       salesAgent,
//       orderDate: orderDate ? new Date(orderDate) : null,
//       notes: Array.isArray(notes) ? notes.join("\n") : notes || "",
//     },
//   },
//   { upsert: true } // create if doesn't exist
// );
