const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',  // Reference to the User model
    },
    fileName: {
        type: String,
        required: true,
        trim: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,  // Size in bytes
        required: true,
    },
    s3Url: {
        type: String,  // Store the presigned URL here
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('File', fileSchema);
