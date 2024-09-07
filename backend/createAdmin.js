const mongoose = require("mongoose");
const User = require("./models/User");  // Adjust the path based on your project structure
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { connectDatabase } = require("./config/database"); 
dotenv.config();  // Load environment variables

// Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log("MongoDB connected");
// }).catch(err => {
//   console.log("MongoDB connection error:", err);
// });

async function createAdmin() {
  try {
    connectDatabase();
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash("admin", 10); // Replace with secure password

    // Create a new admin user
    const adminUser = new User({
      name: "Admin",
      email: "admin@gmail.com",  // Use a proper admin email
      password: hashedPassword,    // Hashed password
      role: "admin",               // Set the role to 'admin'
    });

    await adminUser.save();  // Save the admin user to the database
    console.log("Admin user created successfully!");
  } catch (err) {
    console.error("Error creating admin user:", err);
  } finally {
    mongoose.connection.close();  // Close the database connection
  }
}

createAdmin();  // Call the function to create the admin
