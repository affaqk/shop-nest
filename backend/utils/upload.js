import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Keep the file in memory; it goes straight to Cloudinary and never touches disk
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only JPG, PNG, WEBP or GIF images are allowed"));
        }
        cb(null, true);
    },
});

// Accepts an optional "image" file and sends multer errors back as JSON
export const uploadProductImage = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            const message = err.code === "LIMIT_FILE_SIZE" ? "Image must be 5MB or smaller" : err.message;
            return res.status(400).json({ success: false, message });
        }
        next();
    });
};

// Upload a multer file to Cloudinary, resolves to { url, publicId }
export const uploadToCloudinary = (file) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "shopnest/products" }, (error, result) => {
            if (error) return reject(error);
            resolve({ url: result.secure_url, publicId: result.public_id });
        });
        stream.end(file.buffer);
    });

// Delete an image from Cloudinary (products with an external URL have no publicId)
export const removeImage = (publicId) => {
    if (!publicId) return;
    cloudinary.uploader.destroy(publicId).catch((error) => console.log(error));
};
