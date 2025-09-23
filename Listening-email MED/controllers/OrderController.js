import logger from "../utils/Logger.js";
// import OrderModel from "../models/OrderModel.js";
// import { generatePdf } from "../services/EmailPrinting.js";
import axios from "axios";
const addOrder = async (products, orderDetails) => {
  try {
    const { orderNumber, salesAgent, orderDate, notes } = orderDetails;
    console.log(orderNumber);

    //   if (!orderNumber || products.length === 0) {
    //     logger.warn("Missing required order fields or product list.");
    //     return;
    //   }

    //   // Validate schema
    //   const isProductValid = products.every(
    //     ({ name, quantity, barcode, warehouse }) =>
    //       Boolean(name && quantity && barcode && warehouse)
    //   );

    //   if (!isProductValid) {
    //     logger.warn("Invalid product entry detected. All fields are required.");
    //     return;
    //   }

    //   logger.info(
    //     `Creating or updating order #${orderNumber} with ${products.length} product(s).`
    //   );

    //   // Try create first
    //   try {
    //     const newOrder = await OrderModel.create({
    //       orderNumber,
    //       salesAgent,
    //       orderDate: orderDate ? new Date(orderDate) : null,
    //       notes: Array.isArray(notes) ? notes.join("\n") : notes || "",
    //       products,
    //     });

    //     logger.info(`Order created successfully: ID ${newOrder._id}`);
    console.log(products);

    const res = await axios.post(`http://localhost:5000/api/Lead`, {
      orderNumber,
      salesAgent,
      orderDate,
      products,
      notes,
    });
    console.log(res.data);
    // const pdfPath = await generatePdf(orderInfo);
    return;
  } catch (err) {
    if (err.code !== 11000) throw err;
    logger.warn(
      `Duplicate order #${orderNumber} found. Updating existing order...`
    );
  }
  try {
    // Find and update existing order
    const existingOrder = await OrderModel.findOne({ orderNumber });
    if (!existingOrder) {
      logger.error(`Order #${orderNumber} not found.`);
      return;
    }

    // products = [
    //   {
    //     name: "Rouleau de papier filtrant pour ensacheuse de thé",
    //     quantity: "1",
    //     barcode: "000.000.1063",
    //     warehouse: "MAG",
    //   },
    // ];

    // Remove old MED products & add new ones
    existingOrder.products = [
      ...existingOrder.products.filter((p) => p.warehouse !== "MED"), //all mag already exist
      ...products, //all med comming from email
    ];

    await existingOrder.save();
    logger.info(
      `Updated order #${orderNumber} successfully with MED products.`
    );
    //   logger.debug(
    //     `Updated order details: ${JSON.stringify(existingOrder, null, 2)}`
    //   );

    //   logger.info(`Generated PDF for order #${orderNumber}.....`);
    //   // Generate PDF with just the MED products comming from email
    //   const pdfPath = await generatePdf({
    //     orderNumber,
    //     salesAgent,
    //     orderDate,
    //     products,
    //   });
    //   // i need to add error catching for pdf generation
  } catch (error) {
    logger.error(`Failed to create or update order: ${error.message}`);
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
