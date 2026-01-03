const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Remove "Bearer " prefix if present
    const actualToken = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    
    req.user = decoded; // Contains { id, role }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;