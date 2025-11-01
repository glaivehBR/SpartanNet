import { useState, useEffect } from "react";
import axios from "axios";

export default function CreatePost({ user, addNewPost }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      setMessage("Você precisa estar logado para criar um post!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("userId", user.id);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await axios.post("http://localhost:4000/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "Post criado com sucesso!");
      setTitle("");
      setContent("");
      setImageFile(null);

      if (addNewPost && res.data.post) addNewPost(res.data.post);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || "Erro ao criar post!";
      setMessage(`Erro ao criar post: ${errorMsg}`);
    }
  };

  return (
    <div className="create-post">
      <h2>Criar Novo Post</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={title}
          placeholder="Título"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          value={content}
          placeholder="Conteúdo"
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
        <button type="submit">Postar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
