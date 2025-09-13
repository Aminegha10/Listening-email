import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  barcode: { type: String, required: true },
  warehouse: { type: String, required: true },
});
const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true },
    salesAgent: String,
    orderDate: Date,
    client: String,
    price: Number,
    typedepaiement: String,
    notes: String,
    isCompleted: { type: Boolean },
    products: [productSchema], // Flexible array of products
  },
  { timestamps: true }
);
// ✅ Text index for searching client and salesAgent
orderSchema.index({
  client: "text",
  salesAgent: "text",
  "products.name": "text",
  "products.barcode": "text",
});
// ✅ Unique index on orderNumber to prevent duplicates
orderSchema.index({ orderNumber: 1 }, { unique: true });
// ✅ Index on products.barcode for faster product searches
orderSchema.index({ "products.barcode": 1 });

// ✅ Date index for faster date filtering

orderSchema.index({ createdAt: 1 });
mongoose
  .model("Order", orderSchema)
  .syncIndexes()
  .then(() => console.log("Indexes synced successfully"))
  .catch((err) => console.error("Error syncing indexes:", err));

export default mongoose.model("Order", orderSchema);
