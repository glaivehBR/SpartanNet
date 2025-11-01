const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt"); // Importa bcrypt

const prisma = new PrismaClient();

// Registro de usuário
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Preencha username e senha!" });
  }

  try {
    // Verifica se usuário já existe
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return res.status(400).json({ message: "Usuário já existe" });

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no banco
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    res.json({ message: "Usuário registrado com sucesso", user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ message: "Credenciais inválidas" });

    // Compara a senha digitada com o hash do banco
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Credenciais inválidas" });

    res.json({
      message: "Login bem-sucedido",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

module.exports = router;