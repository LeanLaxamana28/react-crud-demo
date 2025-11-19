import React from "react";

export default function PostCard({ post, onEdit, onDelete }) {
  return (
    <div className="card mb-4 shadow-sm hover-shadow" style={{ borderRadius: '10px', transition: '0.3s' }}>
      <img
        src={post.imageUrl || `https://picsum.photos/400/200?random=${Math.floor(Math.random()*1000)}`}
        className="card-img-top"
        alt="thumbnail"
        style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
      />
      <div className="card-body bg-light">
        <h5 className="card-title text-primary">{post.title}</h5>
        <p className="card-text text-dark">{post.content.substring(0, 120)}...</p>
        <p className="card-text"><small className="text-muted">By: {post.userId}</small></p>
        <div className="d-flex gap-2">
          <button className="btn btn-warning btn-sm" onClick={() => onEdit(post)}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(post.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
