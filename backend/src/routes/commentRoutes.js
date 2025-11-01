const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Criar comentário
router.post("/", async (req, res) => {
  const { postId, text, userId } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    const post = await prisma.post.findUnique({ where: { id: parseInt(postId) } });

    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    if (!post) return res.status(404).json({ message: "Post não encontrado" });

    const comment = await prisma.comment.create({
      data: {
        text,
        postId: post.id,
        userId: user.id,
        createdAt: new Date(),
      },
      include: { user: true },
    });

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar comentário" });
  }
});

module.exports = router;
