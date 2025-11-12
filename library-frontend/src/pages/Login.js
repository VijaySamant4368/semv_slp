import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import { setToken, setUser } from "../api";
import { showToast} from "../components/Toast";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:4000/api/members/login", {
      email,
      password,
    });

    if (res.data && res.data.token) {
      // store token & user in localStorage
      setToken(res.data.token);
      setUser(JSON.stringify(res.data.user));

      setIsLoggedIn(true);
      showToast("Login successful!");

      // ✅ Redirect based on role (no extra route logic)
      const userRole = res.data.user.role;

      if (userRole === "admin") {
        navigate("/adminDashboard");   // 👈 admin goes here
      } else {
        navigate("/books");            // 👈 normal user goes here
      }

    } else {
      setError("Invalid login response. Please try again.");
    }
  } catch (err) {
    console.error("Login error:", err);
    setError(
      err.response?.data?.message ||
        "Invalid email or password. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-text">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
