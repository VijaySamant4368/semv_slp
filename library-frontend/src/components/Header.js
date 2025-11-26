import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { getToken, getUser } from "../api";

const Header = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false); // <-- hamburger state

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isLoggedIn = !!getToken();

  return (
    <nav className="navbar">

      {/* LEFT BRAND */}
      <div className="navbar-left">
        <h1 className="navbar-brand">
          <Link to="/">Book in Hand Campaign</Link>
        </h1>
      </div>

      {/* HAMBURGER BUTTON */}
      <div
        className={`hamburger ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* NAV LINKS */}
      <div className="navbar-right">
        <ul className={open ? "active" : ""}>
          {isLoggedIn ? (
            <>
              {user?.role === "admin" && (
                <li>
                  <Link to="/adminDashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link to="/books" onClick={() => setOpen(false)}>Books</Link>
              </li>
              <li>
                <Link to="/add-book" onClick={() => setOpen(false)}>Add Books</Link>
              </li>
              <li>
                <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
              </li>
              <li>
                <Link to="/logout" onClick={() => setOpen(false)}>Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              </li>
              <li>
                <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>

    </nav>
  );
};

export default Header;
