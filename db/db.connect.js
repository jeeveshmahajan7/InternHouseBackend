const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGODB;

let isConnected = false; // to prevent multiple connections

const initializeDatabase = async () => {
  if (isConnected) return; // exit if already connected

  try {
    await mongoose.connect(mongoURI);

    isConnected = true; // marked connection as active

    console.log("✅ Connected to the database.");
  } catch (error) {
    console.log("❌ Error connecting to the database:", error.message);
  }
};

module.exports = { initializeDatabase };
