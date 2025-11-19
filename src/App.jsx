import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { collection, onSnapshot, query, where, deleteDoc, doc } from "firebase/firestore";

import Navbar from "./components/Navbar";
import Feed from "./components/Feed";
import CreatePost from "./pages/CreatePost";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLogin, setIsLogin] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        const q = query(collection(db, "posts"), where("userId", "==", u.email));
        onSnapshot(q, (snap) => setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
      } else setPosts([]);
    });
    return unsub;
  }, []);

  const handleSignup = async () => {
    try { await createUserWithEmailAndPassword(auth, email, password); setEmail(""); setPassword(""); }
    catch (err) { alert(err.message); }
  };

  const handleLogin = async () => {
    try { await signInWithEmailAndPassword(auth, email, password); setEmail(""); setPassword(""); }
    catch (err) { alert(err.message); }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setEditingPost(null);
  };

  const editPost = (post) => setEditingPost(post);

  const deletePostHandler = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await deleteDoc(doc(db, "posts", id));
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) {
    return (
      <div className="container mt-5" style={{ maxWidth: 400 }}>
        <h2 className="text-center mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
        <input className="form-control mb-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="form-control mb-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <div className="d-grid gap-2 mb-2">
          <button className="btn btn-primary" onClick={isLogin ? handleLogin : handleSignup}>{isLogin ? "Login" : "Sign Up"}</button>
        </div>
        <p className="text-center">
          {isLogin ? "No account?" : "Already have an account?"}{" "}
          <button className="btn btn-link btn-sm" onClick={()=>setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="container mt-3">
        <CreatePost editingPost={editingPost} setEditingPost={setEditingPost} refreshPosts={()=>{}} />
        <input
          className="form-control mb-3"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Feed posts={filteredPosts} editPost={editPost} deletePost={deletePostHandler} />
      </div>
    </div>
  );
}
