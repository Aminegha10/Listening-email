import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  barcode: { type: String, required: true },
  warehouse: { type: String, required: true },
});
const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    salesAgent: String,
    orderDate: Date,
    notes: String,
    products: [productSchema], // Flexible array of products
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
