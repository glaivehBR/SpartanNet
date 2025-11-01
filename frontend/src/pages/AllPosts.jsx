import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AllPosts({ user }) {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [activeComment, setActiveComment] = useState(null); 

  // Buscar Posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/posts");
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Curtir post
  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:4000/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: res.data.likes } : p))
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Criar comentário
  const handleComment = async (postId) => {
    if (!user) return alert("Você precisa estar logado para comentar!");
    if (!commentText.trim()) return;

    try {
      const res = await axios.post("http://localhost:4000/posts/comment", {
        postId,
        userId: user.id,
        text: commentText,
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: [...p.comments, res.data] } : p
        )
      );
      setCommentText("");
      setActiveComment(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="post-list">
      <h2>Feed</h2>
      {posts.length === 0 && <p>Nenhum post ainda!</p>}
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {post.image && (
            <img
              src={`http://localhost:4000/uploads/${post.image}`}
              alt="Post"
              style={{ maxWidth: "100%", borderRadius: "5px" }}
            />
          )}
          <div className="post-footer" style={{ marginTop: "8px" }}>
            <span
              onClick={() => handleLike(post.id)}
              style={{ cursor: "pointer", marginRight: "10px" }}
            >
              ❤️ {post.likes || 0}
            </span>
            <span
              onClick={() =>
                setActiveComment(activeComment === post.id ? null : post.id)
              }
              style={{ cursor: "pointer" }}
            >
              💬 {post.comments?.length || 0}
            </span>
          </div>

          {/* Comentários */}
          {activeComment === post.id && (
            <div className="comment-box" style={{ marginTop: "8px" }}>
              <input
                type="text"
                placeholder="Escreva um comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ width: "70%", marginRight: "5px" }}
              />
              <button onClick={() => handleComment(post.id)}>Enviar</button>
            </div>
          )}

          {/* Lista de comentários */}
          {post.comments?.length > 0 && (
            <div className="comments-list" style={{ marginTop: "8px" }}>
              {post.comments.map((c) => (
                <div key={c.id} style={{ fontSize: "0.9rem", marginBottom: "4px" }}>
                  <strong>{c.author?.username || "Desconhecido"}:</strong> {c.text}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
