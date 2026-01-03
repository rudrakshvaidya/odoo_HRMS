const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const tokenHeader = req.header("Authorization");

  if (!tokenHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Split "Bearer <token>"
    const token = tokenHeader.split(" ")[1];
    if (!token) throw new Error("Format error");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
