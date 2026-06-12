import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <h2>📋 Task Manager</h2>
      </div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>

        <Link to="/tasks">Tasks</Link>

        <Link to="/login">Logout</Link>

        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar;