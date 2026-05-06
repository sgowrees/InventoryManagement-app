const multer = require("multer");

// use memory instead of saving files locally (required for Cloudinary)
const storage = multer.memoryStorage();

// filter allowed file types
function fileFilter(req, file, cb) {
  if (
    file.mimetype === "image/png" ||  file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"
  ) {
    cb(null, true); 
  } else {
    cb(new Error("Unsupported file type"), false); // reject file
  }
}

// initialize multer
const upload = multer({
  storage, // store file in memory
  fileFilter, // validate file type
  limits: { fileSize: 10 * 1024 * 1024 }, // limit file size to 10MB
});

// helper function to format file size (optional use)
const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) return "0 Bytes";
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) +
    " " +
    sizes[index]
  );
};

module.exports = { upload, fileSizeFormatter };
