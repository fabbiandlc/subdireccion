const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const USERS_FILE = "./users.json";

function getUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo users.json:", error);
    return [];
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch (error) {
    console.error("Error guardando users.json:", error);
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });
  }

  jwt.verify(token, "mi_secreto_jwt", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido." });
    }
    req.user = user;
    next();
  });
}

app.post("/register", async (req, res) => {
  const { username, password, role = "user" } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Nombre de usuario y contraseña son requeridos" });
  }

  const users = getUsers();
  const userExists = users.find((u) => u.username === username);

  if (userExists) {
    return res.status(400).json({ error: "El nombre de usuario ya está registrado" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword, role: role || "user" }; // Asegura rol por defecto
  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: "Usuario registrado exitosamente" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Nombre de usuario y contraseña son requeridos" });
  }

  const users = getUsers();
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  // Asegura que el rol siempre esté definido
  const userRole = user.role || "user"; // Valor por defecto si role falta en el usuario
  const token = jwt.sign(
    { username: user.username, role: userRole },
    "mi_secreto_jwt",
    { expiresIn: "1h" }
  );

  res.json({ message: "Inicio de sesión exitoso", token, role: userRole });
});

app.get("/protected-route", authenticateToken, (req, res) => {
  res.json({ message: "Esta es una ruta protegida.", user: req.user });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});