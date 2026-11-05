import mongoose from "mongoose";

export const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];
export const PAYMENT_METHODS = ["card", "paypal", "cod"];

const orderItemSchema = new mongoose.Schema({
    // Title, image and price are copied in so the order stays correct if the product changes or is deleted
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, { _id: false })

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [orderItemSchema],
        validate: (items) => items.length > 0
    },
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        enum: PAYMENT_METHODS,
        required: true
    },
    itemsPrice: {
        type: Number,
        required: true
    },
    shippingPrice: {
        type: Number,
        required: true
    },
    taxPrice: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ORDER_STATUSES,
        default: "Processing"
    }
},{
    timestamps: true
})

const Order = mongoose.model("Order", orderSchema);
export default Order;
