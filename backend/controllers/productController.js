import Product from "../models/productModel.js";
import { uploadToCloudinary, removeImage } from "../utils/upload.js";

export const createProduct = async (req, res) => {
    let uploaded;
    try {
        const { title, description, price, category } = req.body;
        if(!req.file){
            return res.status(400).json({
                success : false,
                message : "Product image is required"
            })
        }
        uploaded = await uploadToCloudinary(req.file);
        const product = await Product.create({ title, description, price, category, image: uploaded.url, imagePublicId: uploaded.publicId });

        if(!product){
            return res.status(400).json({
                success : false,
                message : "Product not created"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Product created successfully",
            product
        })
    } catch (error) {
        removeImage(uploaded?.publicId)
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        if(!products){
            return res.status(400).json({
                success : false,
                message : "No products found"
            })
        }
        return res.status(200).json({
            success : true,
            message : "Products fetched successfully",
            products
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const updateProduct = async (req, res) => {
    let uploaded;
    try {
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(400).json({
                success : false,
                message : "No product found"
            })
        }

        const oldPublicId = product.imagePublicId;
        for(const field of ["title", "description", "price", "category"]){
            if(req.body[field] !== undefined){
                product[field] = req.body[field];
            }
        }
        // A new file replaces the image; otherwise the current one is kept
        if(req.file){
            uploaded = await uploadToCloudinary(req.file);
            product.image = uploaded.url;
            product.imagePublicId = uploaded.publicId;
        }
        await product.save();

        if(uploaded){
            removeImage(oldPublicId)
        }

        return res.status(200).json({
            success : true,
            message : "Product updated successfully",
            product
        })
    } catch(error){
        removeImage(uploaded?.publicId)
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if(!product){
            return res.status(400).json({
                success : false,
                message : "No product found"
            })
        }

        removeImage(product.imagePublicId)

        return res.status(200).json({
            success : true,
            message : "Product deleted successfully"
        })
    } catch (error) {   
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const productDetail = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(400).json({
                success : false,
                message : "No product found"
            })
        }

        return res.status(200).json({
            success : true,
            product
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}