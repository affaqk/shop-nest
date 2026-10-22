import express from "express";
const productRouter = express.Router();
import { createProduct, getAllProducts, updateProduct, productDetail, deleteProduct} from "../controllers/productController.js";
import { isAdmin, isAuthenticated } from "../utils/userAuth.js";

productRouter.post("/create-product", isAuthenticated, isAdmin("admin"), createProduct);
productRouter.get("/get-all-products", getAllProducts);
productRouter.put("/update-product/:id", isAuthenticated, isAdmin("admin"),  updateProduct);
productRouter.delete("/delete-product/:id", isAuthenticated, isAdmin("admin"), deleteProduct);
productRouter.get("/product-detail/:id", productDetail);

export default productRouter;