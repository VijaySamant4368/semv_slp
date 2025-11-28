import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import { showToast } from "../components/Toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [memberId, setMemberId] = useState(null);
  const [showOtp, setShowOtp] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/members/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      if (res.data?.success) {
        showToast(res.data.message);
        setMemberId(res.data.memberId);
        setShowOtp(true); 
      } else {
        showToast(res.data.message || "Signup failed", "error");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      showToast(err.response?.data?.message || "Something went wrong!", "error");
    }
  };

  // Verify OTP function
  const handleVerifyOtp = async () => {
    if (!otp) {
      showToast("Please enter the OTP", "error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/members/verify-otp", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        otp, 
      });

      if (res.data?.success) {
        showToast("Email verified! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      showToast(err.response?.data?.message || "OTP verification failed", "error");
    }
  };


  return (
    <div className="register-page">
      <div className="register-container">
        <form
          className="register-form"
          onSubmit={showOtp ? (e) => e.preventDefault() : handleSubmit}
        >

          <h2>Create Account</h2>

          {!showOtp && (
            <>
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label>WhatsApp Number</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter your WhatsApp Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <button type="submit">Register</button>
            </>
          )}

          {showOtp && (
            <>
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP sent to your email"
                required
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); 
                    handleVerifyOtp();   
                  }
                }}
              />

              <button type="button" onClick={handleVerifyOtp}>
                Verify OTP
              </button>
            </>
          )}

          <p className="login-text">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
