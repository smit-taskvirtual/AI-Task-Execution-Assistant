const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  extractText,
} = require("../services/fileParser");

const router = express.Router();

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

// File upload configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

// Health Check
router.get("/upload", (req, res) => {
  res.json({
    success: true,
    message: "Upload API working",
  });
});

// Upload & Parse Files
router.post(
  "/upload",
  upload.array("files"),
  async (req, res) => {
    try {
      const parsedFiles = [];

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      for (const file of req.files) {
        let content = "";

        try {
          content = await extractText(
            file.path,
            file.mimetype
          );
        } catch (parseError) {
          console.error(
            `Error parsing ${file.originalname}:`,
            parseError
          );

          content =
            "Unable to extract content from file.";
        }

        parsedFiles.push({
          originalName: file.originalname,
          fileName: file.filename,
          mimeType: file.mimetype,
          size: file.size,
          content,
        });
      }

      res.json({
        success: true,
        totalFiles: parsedFiles.length,
        parsedFiles,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;