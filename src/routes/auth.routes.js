const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const { signAccessToken } = require("../utils/token");

router.post(
  "/register",
  body("email").isEmail().withMessage("Email inválido"),
  body("password").isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, role } = req.body;
    try {
      const [rows] = await pool.query("SELECT id FROM usuarios WHERE email=?", [email]);
      if (rows.length) {
        return res.status(409).json({ error: "Email ya registrado" });
      }
      const password_hash = await bcrypt.hash(password, 10);
      const insert = await pool.query(
        "INSERT INTO usuarios (email, password_hash, role) VALUES (?, ?, ?)",
        [email, password_hash, role === "admin" ? "admin" : "user"]
      );
      return res.status(201).json({ message: "Usuario registrado" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Error del servidor" });
    }
  }
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const [rows] = await pool.query("SELECT * FROM usuarios WHERE email=?", [email]);
      if (!rows.length) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
      const user = rows[0];
      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
      const token = signAccessToken({ id: user.id, email: user.email, role: user.role });
      return res.json({ token, role: user.role });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Error del servidor" });
    }
  }
);

module.exports = router;
