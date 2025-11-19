import React from "react";

export default function Navbar({ user, handleLogout }) {
  return (
    <nav className="navbar navbar-dark bg-dark p-3 mb-4 shadow">
      <span className="navbar-brand fs-4 fw-bold" style={{ letterSpacing: '1px' }}>ReactTube</span>
      {user && (
        <div className="d-flex align-items-center gap-3">
          <span className="text-white">{user.email}</span>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
