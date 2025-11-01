function PostCard({ title, content, author }) {
  return (
    <div style={{ border: '1px solid #444', margin: 10, padding: 10, borderRadius: 5 }}>
      <h3>{title}</h3>
      <p>{content}</p>
      <small>Por: {author}</small>
    </div>
  );
}

export default PostCard;
