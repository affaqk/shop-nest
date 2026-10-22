import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if (!token) {
            return res.status(401).json({message: "Please login to continue"});
        };

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.userId);
        if (!req.user) {
            return res.status(401).json({message: "Please login to continue"});
        }
        next()
    } catch (error) {
        return res.status(401).json({message: "Please login to continue"});
    }
}

export const isAdmin = (...roles) => {
    return async (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: "You are not allowed to access this route"});
        }
        next()
    }
}