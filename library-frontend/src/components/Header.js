import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { getToken } from "../api";

const Header = () => {
  const isLoggedIn = !!getToken();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-brand">
          {isLoggedIn ? (
        <Link to="/">Book in Hand Campaign</Link>
      ) : (
        <Link to="/">Book in Hand Campaign</Link>
      )}
        </h1>
      </div>
      <div className="navbar-right">
        <ul>
          {isLoggedIn ? (
            <>
              {/* <li><Link to="/About">About</Link></li> */}
              <li><Link to="/books">Books</Link></li>
              <li><Link to="/add-book">Add Books</Link></li>
              {/* <li><Link to="/volunteer">Volunteer</Link></li> */}
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
