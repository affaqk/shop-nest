import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    // Cloudinary id of the image, used to delete it when it is replaced or removed
    imagePublicId: String,
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

const Product = mongoose.model("Product", productSchema);
export default Product;