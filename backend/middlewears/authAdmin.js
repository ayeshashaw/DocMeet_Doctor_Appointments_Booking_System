const jwt = require("jsonwebtoken");

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // Extract token
    const aToken = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(aToken, process.env.JWT_SECRET);

    // Check if the token contains the correct admin email
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: "Forbidden access" });
    }

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = authAdmin;
