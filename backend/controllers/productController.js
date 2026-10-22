import Product from "../models/productModel.js";

export const createProduct = async (req, res) => {
    try {
        const { title, description, price, category, image,  } = req.body;
        const product = await Product.create({ title, description, price, category, image,  });

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
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            runValidators : true,
            new : true
        })

        if(!product){
            return res.status(400).json({
                success : false,
                message : "No product found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Product updated successfully",
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

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if(!product){
            return res.status(400).json({
                success : false,
                message : "No product found"
            })
        }

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