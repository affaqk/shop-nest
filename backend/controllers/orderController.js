import mongoose from "mongoose";
import Order, { ORDER_STATUSES } from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Keep these in sync with frontend/src/context/cart.js
const TAX_RATE = 0.08;
const FREE_SHIPPING_MIN = 100;
const SHIPPING_FEE = 9.99;

const round = (value) => Math.round(value * 100) / 100;

export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        if(!Array.isArray(items) || !items.length){
            return res.status(400).json({
                success : false,
                message : "Your cart is empty"
            })
        }

        const ids = items.map((item) => item.product);
        if(!ids.every((id) => mongoose.isValidObjectId(id))){
            return res.status(400).json({
                success : false,
                message : "Some items in your cart are not available"
            })
        }

        // Prices always come from the database, never from the client
        const products = await Product.find({ _id: { $in: ids } });
        const orderItems = [];
        for(const item of items){
            const product = products.find((p) => p._id.toString() === String(item.product));
            const quantity = Number(item.quantity);
            if(!product){
                return res.status(400).json({
                    success : false,
                    message : "Some items in your cart are no longer available"
                })
            }
            if(!Number.isInteger(quantity) || quantity < 1){
                return res.status(400).json({
                    success : false,
                    message : `Invalid quantity for ${product.title}`
                })
            }
            orderItems.push({ product: product._id, title: product.title, image: product.image, price: product.price, quantity });
        }

        const itemsPrice = round(orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
        const shippingPrice = itemsPrice >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
        const taxPrice = round(itemsPrice * TAX_RATE);
        const totalPrice = round(itemsPrice + shippingPrice + taxPrice);

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        });

        return res.status(201).json({
            success : true,
            message : "Order placed successfully",
            order
        })
    } catch (error) {
        console.log(error)
        if(error.name === "ValidationError"){
            return res.status(400).json({
                success : false,
                message : "Please fill in all shipping and payment details"
            })
        }
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            success : true,
            orders
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email profile").sort({ createdAt: -1 });

        return res.status(200).json({
            success : true,
            message : "All orders fetched successfully",
            orders
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

// Customers can see their own orders; admins can see any order
export const orderDetail = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email profile");

        if(!order || (req.user.role !== "admin" && order.user?._id.toString() !== req.user._id.toString())){
            return res.status(400).json({
                success : false,
                message : "Order not found"
            })
        }

        return res.status(200).json({
            success : true,
            order
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if(!ORDER_STATUSES.includes(status)){
            return res.status(400).json({
                success : false,
                message : `Status must be one of: ${ORDER_STATUSES.join(", ")}`
            })
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { status }, {
            runValidators : true,
            new : true
        }).populate("user", "name email profile");

        if(!order){
            return res.status(400).json({
                success : false,
                message : "Order not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Order status updated successfully",
            order
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if(!order){
            return res.status(400).json({
                success : false,
                message : "Order not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Order deleted successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}
