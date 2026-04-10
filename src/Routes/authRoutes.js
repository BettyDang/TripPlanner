const express = require("express");
const { register, login  } = require("../Controllers/authController");
const { authMiddleware } = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware);
router.get("/users", authMiddleware);

module.exports = router;