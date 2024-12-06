import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Optional: Add CSS for sidebar styling.

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/emailHome">E-mail</Link>
        </li>
        <li>
          <Link to="/smsHome">SMS</Link>
        </li>
        <li>
          <Link to="/chatHome">Chat</Link>
        </li>
        <li>
          <Link to="/call">Call</Link>
        </li>
        <li>
          <button className="btn btn-outline-none text-white text-align-start" onClick={handleLogout}>Log out</button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
