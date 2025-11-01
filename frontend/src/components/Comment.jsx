function Comment({ text, author }) {
  return (
    <div style={{ borderTop: '1px solid #333', padding: 5 }}>
      <p>{text}</p>
      <small>Por: {author}</small>
    </div>
  );
}

export default Comment;
