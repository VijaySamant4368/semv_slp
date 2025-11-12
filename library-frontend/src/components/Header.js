import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { getToken, getUser } from "../api";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isLoggedIn = !!getToken();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-brand">
          <Link to="/">Book in Hand Campaign</Link>
        </h1>
      </div>
      <div className="navbar-right">
        <ul>
          {isLoggedIn ? (
            <>{user?.role !== "admin" && (
                <li><Link to="/books">Books</Link></li>
              )}
              
              <li><Link to="/add-book">Add Books</Link></li>

              {/* Admin-only link */}
              {user?.role === "admin" && (
                <li><Link to="/adminDashboard">Dashboard</Link></li>
              )}

              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/logout">Logout</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/Register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
