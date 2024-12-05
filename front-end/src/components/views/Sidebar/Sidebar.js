import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Optional: Add CSS for sidebar styling.

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <Link to="/">Home</Link>
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
      </ul>
    </nav>
  );
};

export default Sidebar;
