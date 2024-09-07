const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config()

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },

  avatar: {
    public_id: String,
    url: String,
  },

  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Allow only 'user' or 'admin'
    default: 'user' // Default role is 'user'
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});




// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }

//   next();
// });

userSchema.methods.matchPassword = async function (password) {
  console.log('Entered password:', password); // Log the password provided by the user
  console.log('Hashed password:', this.password); // Log the hashed password stored in the database

  return await bcrypt.compare(password, this.password); // Compare the entered password with the stored hashed password
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
