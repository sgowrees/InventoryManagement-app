const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// configure cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload file buffer to cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "inventory-app", // folder name in cloudinary
        transformation: [{ width: 500, height: 500, crop: "limit" }], // resize image
      },
      (error, result) => {
        if (error) reject(error); // reject if error
        else resolve(result); // return result if success
      }
    );

    // convert buffer to readable stream and send to cloudinary
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// delete image from cloudinary (used later for update/delete)
const deleteFromCloudinary = async (public_id) => {
  return await cloudinary.uploader.destroy(public_id);
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };