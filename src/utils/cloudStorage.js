
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloud = async (file) => {
  if (!file) {
    throw new Error("File not received in uploadToCloud");
  }

  const result = await cloudinary.uploader.upload(file.path, {
    folder: "greenfin-documents",
    resource_type: "auto",
  });

  // remove local temp file
  fs.unlinkSync(file.path);

  return result.secure_url; // 🔥 REAL PUBLIC URL
};

