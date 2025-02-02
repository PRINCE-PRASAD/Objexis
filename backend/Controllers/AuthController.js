// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const UserModel = require("../Models/User");


// const signup = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const user = await UserModel.findOne({ email });
//         if (user) {
//             return res.status(409)
//                 .json({ message: 'User is already exist, you can login', success: false });
//         }
//         const userModel = new UserModel({ name, email, password });
//         userModel.password = await bcrypt.hash(password, 10);
//         await userModel.save();
//         res.status(201)
//             .json({
//                 message: "Signup successfully",
//                 success: true
//             })
//     } catch (err) {
//         res.status(500)
//             .json({
//                 message: "Internal server errror",
//                 success: false
//             })
//     }
// }


// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await UserModel.findOne({ email });
//         const errorMsg = 'Auth failed email or password is wrong';
//         if (!user) {
//             return res.status(403)
//                 .json({ message: errorMsg, success: false });
//         }
//         const isPassEqual = await bcrypt.compare(password, user.password);
//         if (!isPassEqual) {
//             return res.status(403)
//                 .json({ message: errorMsg, success: false });
//         }
//         const jwtToken = jwt.sign(
//             { email: user.email, _id: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: '24h' }
//         )

//         res.status(200)
//             .json({
//                 message: "Login Success",
//                 success: true,
//                 jwtToken,
//                 email,
//                 name: user.name
//             })
//     } catch (err) {
//         res.status(500)
//             .json({
//                 message: "Internal server errror",
//                 success: false
//             })
//     }
// }

// module.exports = {
//     signup,
//     login
// } 


// ---------------------------------------------------------------


// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const UserModel = require('../Models/User');

// // Helper function for sending responses
// const sendResponse = (res, status, success, message, data = {}) => {
//     return res.status(status).json({ success, message, ...data });
// };

// // Signup Controller
// const signup = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Validate inputs
//         if (!name || !email || !password) {
//             return sendResponse(res, 400, false, 'All fields (name, email, password) are required.');
//         }

//         // Check if user already exists
//         const existingUser = await UserModel.findOne({ email });
//         if (existingUser) {
//             return sendResponse(res, 409, false, 'User already exists. Please log in.');
//         }

//         // Hash password before saving
//         const hashedPassword = await bcrypt.hash(password, 10);
//         console.log("New Hashed Password:", hashedPassword); // Debugging

//         // Save new user
//         const newUser = new UserModel({ name, email, password: hashedPassword });
//         await newUser.save();

//         return sendResponse(res, 201, true, 'Signup successful.');
//     } catch (err) {
//         console.error("Signup Error:", err);
//         return sendResponse(res, 500, false, 'Internal server error.');
//     }
// };

// // Login Controller
// const login = async (req, res) => {
//     try {
//         console.log("Login Attempt:", req.body); // Debugging

//         const { email, password } = req.body;

//         // Validate inputs
//         if (!email || !password) {
//             return sendResponse(res, 400, false, 'Email and password are required.');
//         }

//         // Find user
//         const user = await UserModel.findOne({ email });
//         if (!user) {
//             console.log("User not found:", email);
//             return sendResponse(res, 403, false, 'Auth failed: Invalid email or password.');
//         }

//         // Ensure stored password is hashed before comparing
//         if (!user.password.startsWith("$2b$")) {
//             console.log("Stored password is not hashed. Possible issue in signup process.");
//             return sendResponse(res, 500, false, 'Internal server error. Please reset your password.');
//         }

//         // Check password
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         console.log("Entered Password:", password);
//         console.log("Stored Hashed Password:", user.password);
//         console.log("Password Match:", isPasswordValid);

//         if (!isPasswordValid) {
//             console.log("Password mismatch for:", email);
//             return sendResponse(res, 403, false, 'Auth failed: Invalid email or password.');
//         }

//         // Generate JWT Token
//         const jwtToken = jwt.sign(
//             { _id: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: '24h' }
//         );

//         console.log("Login Success:", { email, userId: user._id });

//         return sendResponse(res, 200, true, 'Login successful.', {
//             jwtToken,
//             userId: user._id,
//             name: user.name,
//         });
//     } catch (err) {
//         console.error("Login Error:", err);
//         return sendResponse(res, 500, false, 'Internal server error.');
//     }
// };

// module.exports = { signup, login };

// ------------------------------------------------------

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

// Signup Controller
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists. Please log in."
            });
        }

        // Hash password manually before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Debugging log
        console.log("Original Password:", password);
        console.log("Hashed Password:", hashedPassword);

        // Create user instance with hashed password
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { _id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },
            token
        });
    } catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = { signup };

// Login Controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            console.log("Login failed: User not found ->", email);
            return res.status(403).json({
                message: "Auth failed: Invalid email or password.",
                success: false
            });
        }


        // Log email and received password for debugging
        console.log("Login attempt for email:", email);
        console.log("Entered password:", password);
        console.log("Stored hashed password:", user.password);

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Login failed: Incorrect password ->", email);
            return res.status(403).json({
                message: "Auth failed: Invalid email or password.",
                success: false
            });
        }

        // Generate JWT Token
        const jwtToken = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        console.log("Login Success:", { email, userId: user._id });

        return res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: user.name
        });
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = { signup, login };
