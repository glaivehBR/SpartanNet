const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");

const prisma = new PrismaClient();

// Configuração Multer para upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Criar post
router.post("/", upload.single("image"), async (req, res) => {
  const { title, content, userId } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        image,
        authorId: user.id,
        likes: 0,
      },
    });

    res.json({ message: "Post criado com sucesso!", post });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro ao criar post" });
  }
});

// Listar posts
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: { include: { author: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro ao buscar posts" });
  }
});

// Curtir post
router.post("/:id/like", async (req, res) => {
  const postId = parseInt(req.params.id);
  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });
    res.json({ likes: post.likes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro ao curtir post" });
  }
});

// Criar comentário
router.post("/comment", async (req, res) => {
  const { postId, userId, text } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: {
        text,
        postId: parseInt(postId),
        authorId: parseInt(userId),
      },
      include: { author: true },
    });
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro ao criar comentário" });
  }
});

module.exports = router;
