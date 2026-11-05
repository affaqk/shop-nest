import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";

export const UPLOAD_DIR = path.resolve("uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const allowedTypes = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
};

const storage = multer.diskStorage({
    destination: UPLOAD_DIR,
    // Random name so uploads never overwrite each other or use the client's filename
    filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${allowedTypes[file.mimetype]}`),
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!allowedTypes[file.mimetype]) {
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

// Full URL for an uploaded file, e.g. http://localhost:8000/uploads/123-abc.jpg
export const fileUrl = (req, file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

// Remove an image from disk if it is one of our uploads (external URLs are left alone)
export const removeUploadedImage = (url) => {
    if (!url || !url.includes("/uploads/")) return;
    const filePath = path.join(UPLOAD_DIR, path.basename(url));
    fs.promises.unlink(filePath).catch(() => {});
};

// Clean up a just-uploaded file when the request fails
export const discardUpload = (req) => {
    if (req.file) fs.promises.unlink(req.file.path).catch(() => {});
};
