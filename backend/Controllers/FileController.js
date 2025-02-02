// file.controller.js
const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require("multer");
const File = require("../Models/File");
const dotenv = require("dotenv");
dotenv.config();

// AWS S3 Configuration
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Configure Multer for handling file uploads (Not used due to pre-signed URLs)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });




const fetchUserFiles = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const userId = req.user._id; // Ensure the user info is available here

        const files = await File.find({ userId });

        return res.status(200).json({ success: true, files });
    } catch (error) {
        console.error('Error fetching user files:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch files' });
    }
};


const generatePreviewUrl = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { fileId } = req.params;
        const userId = req.user._id;

        const file = await File.findOne({ _id: fileId, userId });
        if (!file) {
            return res.status(404).json({ success: false, message: "File not found or unauthorized access" });
        }

        const s3UrlPrefix = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
        const fileKey = file.s3Url.replace(s3UrlPrefix, "");

        if (!fileKey) {
            return res.status(400).json({ success: false, message: "Invalid S3 URL format" });
        }

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            Expires: 300, // URL valid for 5 minutes
        };

        const previewUrl = await getSignedUrl(s3, new GetObjectCommand(params));

        res.status(200).json({ success: true, previewUrl });
    } catch (error) {
        console.error("Generate preview URL error:", error);
        res.status(500).json({ success: false, message: "Error generating preview URL" });
    }
};







// Delete file from AWS S3 and MongoDB
const deleteFile = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const userId = req.user._id;
        const { fileId } = req.params;

        const file = await File.findOne({ _id: fileId, userId });
        if (!file) {
            return res.status(404).json({ success: false, message: "File not found or unauthorized access" });
        }

        // Correct file key extraction
        const s3UrlPrefix = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
        const fileKey = file.s3Url.replace(s3UrlPrefix, "");

        if (!fileKey) {
            return res.status(400).json({ success: false, message: "Invalid S3 URL format" });
        }

        console.log("Deleting file from S3:", fileKey); // Debugging log

        // Delete from S3
        await s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: fileKey }));

        // Delete from MongoDB
        await File.deleteOne({ _id: fileId });

        res.status(200).json({ success: true, message: "File deleted successfully" });
    } catch (error) {
        console.error("Delete file error:", error);
        res.status(500).json({ success: false, message: "Error deleting file", error: error.message });
    }
};


const generateUploadUrl = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized. User ID is missing." });
        }

        const userId = req.user._id; // ✅ Correctly extracting userId
        const { fileName, fileType } = req.body;

        if (!fileName || !fileType) {
            return res.status(400).json({ success: false, message: "Missing fileName or fileType" });
        }

        const fileKey = `uploads/${userId}/${Date.now()}-${fileName}`;

        console.log("Generated fileKey:", fileKey); // ✅ Debugging step

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            ContentType: fileType,
            ACL: "private",
        };

        const uploadUrl = await getSignedUrl(s3, new PutObjectCommand(params), { expiresIn: 300 });

        res.status(200).json({ success: true, uploadUrl, fileKey });
    } catch (error) {
        console.error("Generate pre-signed URL error:", error);
        res.status(500).json({ success: false, message: "Error generating upload URL", error: error.message });
    }
};

// Save file details in MongoDB after successful upload
const saveFileMetadata = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(400).json({ success: false, message: "User ID is missing in request" });
        }

        const userId = req.user._id;
        const { fileName, fileKey, fileSize, fileType } = req.body;

        console.log("Decoded User ID:", userId);
        console.log("Received Metadata:", req.body);

        if (!fileName || !fileKey || !fileSize || !fileType) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing file metadata. Required: fileName, fileKey, fileSize, fileType." 
            });
        }

        const newFile = new File({
            userId,  
            fileName,  // ✅ Ensuring field matches schema
            fileSize,
            fileType,
            s3Url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
        });

        await newFile.save();

        res.status(201).json({ success: true, message: "File metadata saved successfully", file: newFile });
    } catch (error) {
        console.error("Save file metadata error:", error);
        res.status(500).json({ success: false, message: "Error saving file metadata", error: error.message });
    }
};




module.exports = { upload, fetchUserFiles, deleteFile, generateUploadUrl, saveFileMetadata, generatePreviewUrl};
