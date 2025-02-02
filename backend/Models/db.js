const mongoose = require('mongoose');

// Fetch the MongoDB URI from environment variables
const mongo_url = process.env.MONGO_CONN;

const connectDB = async () => {
    try {
        await mongoose.connect(mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB Connection Error: ', err);
        // Optionally retry connection or exit on failure
        process.exit(1); // Exit the process if connection fails
    }
};

// Connect to MongoDB when this module is imported
connectDB();

module.exports = mongoose;
