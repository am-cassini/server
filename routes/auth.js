const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

const ADMIN_USER = {
  username: "admin",
  password: "$2b$10$wKQsXKplM04L7VX0gEzAhOYb8Aapz6B3AyQKd6eqgL8PGtzUeRWXO", // example hashed version
};

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER.username) {
    const isMatch = await bcrypt.compare(password, ADMIN_USER.password);

    if (isMatch) {
      const token = jwt.sign({ username }, "secretkey", { expiresIn: "1h" });
      return res.json({ token });
    }
  }

  res.status(401).json({ message: "Invalid credentials" });
});

module.exports = router;
