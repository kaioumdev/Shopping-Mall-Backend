const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Accept userId and role directly so callers don't need a second DB round-trip.
// Falls back to a single DB lookup only when role is not supplied (backwards compat).
const generateToken = (userId, role) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET_KEY environment variable is not set");
  }
  const token = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1h" });
  return token;
};

module.exports = generateToken;