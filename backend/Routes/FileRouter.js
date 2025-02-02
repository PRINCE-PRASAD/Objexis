const express = require("express");
const router = express.Router();
const { uploadFile, fetchUserFiles, deleteFile, generateUploadUrl, saveFileMetadata, generatePreviewUrl } = require("../Controllers/FileController");
const ensureAuthenticated = require("../Middlewares/Auth");

// Generate a pre-signed upload URL
router.post("/generate-upload-url", ensureAuthenticated, generateUploadUrl);

// Save file metadata after upload
router.post("/save-metadata", ensureAuthenticated, saveFileMetadata);

// Fetch files uploaded by the user
// router.get("/fetch:userId", ensureAuthenticated, fetchUserFiles);

router.get("/fetch/:userId", ensureAuthenticated, (req, res) => {
    console.log("Fetching files for userId:", req.params.userId);
    fetchUserFiles(req, res);
});

router.get("/preview/:fileId", ensureAuthenticated, generatePreviewUrl);

// Delete a file
router.delete("/delete/:fileId", ensureAuthenticated, deleteFile);

module.exports = router;
