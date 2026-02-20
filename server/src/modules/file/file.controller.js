import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload.js";

export const uploadFile = catchError(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }

  try {
    // Upload to Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    res.json({
      message: "File uploaded successfully",
      file: {
        name: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: result.secure_url
      }
    });
  } catch (error) {
    return next(new AppError("Failed to upload file to Cloudinary", 500));
  }
});
