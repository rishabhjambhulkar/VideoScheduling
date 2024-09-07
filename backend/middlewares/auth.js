const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  console.log('Cookies:', req.cookies); // Log cookies

  try {
    const { token } = req.cookies;
    console.log('Token:', token); // Log the token

    if (!token) {
      console.log('No token found. User is not authenticated.');
      return res.status(401).json({
        message: "Please login first",
      });
    }

    // Verify token
    console.log('Verifying token...',process.env.JWT_SECRET);
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded); // Log the decoded token

    // Fetch user from database
    console.log('Finding user with ID:', decoded.id);
    const user = await User.findById(decoded.id);
    
    // Check if user exists
    if (!user) {
      console.log('User not found. Please login again.');
      return res.status(401).json({
        message: "User not found. Please login again.",
      });
    }

    // Attach user to request object
    req.user = user;
    console.log('Authorized user:', req.user);

    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(500).json({
      message: 'Internal server error. Please try again later.',
    });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};