import React, { useState, useEffect } from "react";
import { db, storage, auth } from "../firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CreatePost({ editingPost, setEditingPost, refreshPosts }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
    }
  }, [editingPost]);

  const handleSubmit = async () => {
    if (!title || !content) return;

    let imageUrl = editingPost?.imageUrl || "";

    if (file) {
      const storageRef = ref(storage, `posts/${file.name}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    if (editingPost) {
      await updateDoc(doc(db, "posts", editingPost.id), { title, content, imageUrl });
      setEditingPost(null);
    } else {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        userId: auth.currentUser.email,
        createdAt: new Date(),
        imageUrl
      });
    }

    setTitle("");
    setContent("");
    setFile(null);
    refreshPosts();
  };

  const handleCancel = () => {
    setEditingPost(null);
    setTitle("");
    setContent("");
    setFile(null);
  };

  return (
    <div className="card mb-4 p-3 shadow" style={{ borderRadius: '12px' }}>
      <h4 className="text-success">{editingPost ? "Edit Post" : "Create Post"}</h4>
      <input className="form-control mb-2" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
      <textarea className="form-control mb-2" placeholder="Content" value={content} onChange={(e)=>setContent(e.target.value)} />
      <input type="file" className="form-control mb-2" onChange={(e)=>setFile(e.target.files[0])} />
      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={handleSubmit}>
          {editingPost ? "Update Post" : "Add Post"}
        </button>
        {editingPost && <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>}
      </div>
    </div>
  );
}
