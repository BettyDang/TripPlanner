const express = require("express");
const { register, login, getMe , listUsers  } = require("../Controllers/authController");
const { authMiddleware } = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.get("/users", authMiddleware, listUsers);

module.exports = router;