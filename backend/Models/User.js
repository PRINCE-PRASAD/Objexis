const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    files: [
        {
            filename: { type: String, required: true },
            s3Url: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now },
        },
    ],
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;