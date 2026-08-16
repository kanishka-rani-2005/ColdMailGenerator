const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
        // console.warn('MongoDB URI is not set. Server started without database connection.');
        return null;
    }

    try {
        const conn = await mongoose.connect(mongoUri);
        // console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        // console.error(`Error connecting to MongoDB: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;