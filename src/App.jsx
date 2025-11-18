import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "firebase/auth";
import { 
  collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc 
} from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        const q = query(collection(db, "posts"), where("userId", "==", u.uid));
        onSnapshot(q, (snap) => {
          setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
      } else {
        setPosts([]);
      }
    });
    return unsub;
  }, []);

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail(""); setPassword("");
    } catch (err) { alert(err.message); }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail(""); setPassword("");
    } catch (err) { alert(err.message); }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setEditingPost(null);
  };

  const createOrUpdatePost = async () => {
    if (!title || !content) return;
    if (editingPost) {
      await updateDoc(doc(db, "posts", editingPost.id), { title, content });
      setEditingPost(null);
    } else {
      await addDoc(collection(db, "posts"), { title, content, userId: user.uid });
    }
    setTitle(""); setContent("");
  };

  const editPost = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await deleteDoc(doc(db, "posts", id));
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.content.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) {
    return (
      <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
        {isLogin ? (
          <button onClick={handleLogin}>Login</button>
        ) : (
          <button onClick={handleSignup}>Sign Up</button>
        )}
        <p>
          {isLogin ? "No account?" : "Already have an account?"} 
          <button onClick={()=>setIsLogin(!isLogin)}>{isLogin ? "Sign Up" : "Login"}</button>
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "50px auto" }}>
      <h2>Welcome, {user.email}</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>{editingPost ? "Edit Post" : "Create Post"}</h3>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} /><br/>
      <textarea placeholder="Content" value={content} onChange={e=>setContent(e.target.value)}></textarea><br/>
      <button onClick={createOrUpdatePost}>{editingPost ? "Update Post" : "Add Post"}</button>
      {editingPost && <button onClick={()=>{setEditingPost(null); setTitle(""); setContent("");}}>Cancel</button>}

      <h3>Your Posts</h3>
      <input placeholder="Search posts..." value={search} onChange={e=>setSearch(e.target.value)} /><br/>
      <ul>
        {filteredPosts.map(p => (
          <li key={p.id}>
            <b>{p.title}</b>: {p.content} <br/>
            <button onClick={()=>editPost(p)}>Edit</button>
            <button onClick={()=>deletePost(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
