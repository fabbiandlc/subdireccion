const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware para analizar JSON
app.use(bodyParser.json());

// Ruta al archivo JSON que actúa como "base de datos"
const USERS_FILE = "./users.json";

// Leer usuarios desde el archivo JSON
function getUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Guardar usuarios en el archivo JSON
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

// Middleware para verificar el token JWT
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

// Ruta para registrar un nuevo usuario
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Nombre de usuario y contraseña son requeridos" });
  }

  const users = getUsers();
  const userExists = users.find((u) => u.username === username);

  if (userExists) {
    return res.status(400).json({ error: "El nombre de usuario ya está registrado" });
  }

  // Cifrar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Guardar el nuevo usuario
  const newUser = { username, password: hashedPassword };
  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: "Usuario registrado exitosamente" });
});

// Ruta para iniciar sesión
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

  // Verificar la contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  // Generar un token JWT
  const token = jwt.sign({ username: user.username }, "mi_secreto_jwt", { expiresIn: "1h" });

  res.json({ message: "Inicio de sesión exitoso", token });
});

// Ruta protegida de ejemplo
app.get("/protected-route", authenticateToken, (req, res) => {
  res.json({ message: "Esta es una ruta protegida.", user: req.user });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});