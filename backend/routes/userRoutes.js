import express from "express";
const userRouter = express.Router();
import { registerUser, resetPassword, loginUser, getAllUsers, userProfile, updateUser, deleteUser, resetPasswordRequest, getWishlist, addToWishlist, removeFromWishlist } from "../controllers/userController.js";
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

export default userRouter;
