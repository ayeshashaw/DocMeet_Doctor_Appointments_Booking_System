const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");

// Ensure the 'uploads' directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadDir); // Use the absolute path
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname); // Keep original name
    },
});

const uploads = multer({ storage });

module.exports = uploads;
