import express from "express";
const userRouter = express.Router();
import { registerUser, resetPassword, loginUser, getAllUsers, userProfile, updateUser, deleteUser, resetPasswordRequest, getWishlist, addToWishlist, removeFromWishlist, getAddresses, addAddress, updateAddress, deleteAddress } from "../controllers/userController.js";
import { isAdmin, isAuthenticated, isSelfOrAdmin } from "../utils/userAuth.js";

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/all", isAuthenticated, isAdmin("admin"), getAllUsers);
userRouter.get("/profile/:id", isAuthenticated, isSelfOrAdmin, userProfile);
userRouter.put("/update/:id", isAuthenticated, isSelfOrAdmin, updateUser);
userRouter.delete("/delete/:id", isAuthenticated, isSelfOrAdmin, deleteUser);
userRouter.post("/reset-password-request", resetPasswordRequest);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.get("/wishlist", isAuthenticated, getWishlist);
userRouter.post("/wishlist/:productId", isAuthenticated, addToWishlist);
userRouter.delete("/wishlist/:productId", isAuthenticated, removeFromWishlist);
userRouter.get("/addresses", isAuthenticated, getAddresses);
userRouter.post("/addresses", isAuthenticated, addAddress);
userRouter.put("/addresses/:addressId", isAuthenticated, updateAddress);
userRouter.delete("/addresses/:addressId", isAuthenticated, deleteAddress);

export default userRouter;
