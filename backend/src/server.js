require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use('/uploads', express.static('uploads'));


// rota raiz de teste
app.get('/', (req, res) => {
  res.send('API Halo funcionando 🚀');
});

// importar rotas
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

// usar rotas
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
