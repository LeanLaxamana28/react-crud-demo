import React from "react";
import PostCard from "./Postcard";

export default function Feed({ posts, editPost, deletePost }) {
  return (
    <div className="row">
      {posts.map((p) => (
        <div key={p.id} className="col-md-6 col-lg-4">
          <PostCard post={p} onEdit={editPost} onDelete={deletePost} />
        </div>
      ))}
    </div>
  );
}
