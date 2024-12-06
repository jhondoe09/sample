import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/views/Sidebar/Sidebar";
import "./App.css"; // Add styling for your layout here.

const App = () => {
  return (
    <div className="app-container">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content area */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
