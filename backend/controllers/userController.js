import crypto from "crypto";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendMail } from "../utils/sendMail.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, profile} = req.body;
        const user = await User.create({name, email, password, profile});
        if(!user){
            return res.status(400).json({
                success : false,
                message : "User not created"
            })
        }

        sendToken(user, res, 201);
    } catch (error){
        console.log(error);
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body || {}

        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "Email and password are required"
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success : false,
                message : "User not found"
            })
        }

        const isPasswordMatched = await user.comparePassword(password);

        if(!isPasswordMatched){
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials"
            })
        }

        sendToken(user, res, 200);
    } catch (error){
        console.log(error);
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json({
            success : true,
            message : "All users fetched successfully",
            users
        })
    } catch (error){
        console.log(error);
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const userProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(400).json({
                success : false,
                message : "User not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "User profile fetched successfully",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(400).json({
                success : false,
                message : "User not found"
            })
        }

        // Only these fields can be changed; only admins can change a role
        const allowedFields = ["name", "email", "profile", "password"];
        if(req.user.role === "admin"){
            allowedFields.push("role");
        }
        for(const field of allowedFields){
            if(req.body[field] !== undefined){
                user[field] = req.body[field];
            }
        }

        // save() (not findByIdAndUpdate) so the pre-save hook hashes a new password
        await user.save();

        return res.status(200).json({
            success : true,
            message : "User updated successfully",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(400).json({
                success : false,
                message : "User not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "User Deleted successfully",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const resetPasswordRequest = async (req, res) => {
    try{
        const { email } = req.body;
        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({
                success : false,
                message : "User not found"
            })
        }

        const token = user.createResetToken()
        await user.save({ validateBeforeSave : false })
        const url = `http://localhost:5173/reset-password/${token}`
        const message = `Your password reset link is ${url}`;


        await sendMail({
            email : user.email,
            message,
            subject : "Password Reset"
        });

        return res.status(200).json({
            success : true,
            message : `Password reset link sent to your email ${user.email}`
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire : {$gt : Date.now()}
        })

        if(!user){
            return res.status(400).json({
                success : false,
                message : "Invalid token or token has been expired"
            })
        }

        const { newPassword, confirmNewPassword } = req.body;
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({
                success : false,
                message : "Password does not match"
            })
        }

        user.password = newPassword;    
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save()

        sendToken(user, res, 201);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

// Wishlist of the logged-in user, as full product objects
const sendWishlist = async (userId, res, message) => {
    const user = await User.findById(userId).populate("wishlist");
    // Products deleted by an admin come back as null, so leave them out
    const wishlist = user.wishlist.filter(Boolean);

    return res.status(200).json({
        success : true,
        message,
        wishlist
    })
}

export const getWishlist = async (req, res) => {
    try {
        return await sendWishlist(req.user._id, res, "Wishlist fetched successfully");
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = mongoose.isValidObjectId(productId) && await Product.exists({ _id: productId });
        if(!product){
            return res.status(400).json({
                success : false,
                message : "Product not found"
            })
        }

        // $addToSet never adds the same product twice
        await User.updateOne({ _id: req.user._id }, { $addToSet: { wishlist: productId } });
        return await sendWishlist(req.user._id, res, "Added to wishlist");
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        if(mongoose.isValidObjectId(productId)){
            await User.updateOne({ _id: req.user._id }, { $pull: { wishlist: productId } });
        }
        return await sendWishlist(req.user._id, res, "Removed from wishlist");
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}
