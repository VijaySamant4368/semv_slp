import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";
import { showToast } from "../components/Toast";
import { setToken, setUser } from "../api";

const Logout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleYes = async () => {
    setIsProcessing(true);

    try {
      // Remove auth token & user data
      setToken("");
      setUser("");

      

      setTimeout(() => {
      // Show success toast and wait before redirecting
      showToast("You have been logged out successfully.");
      
      // Wait for the toast to be displayed before redirecting
      setTimeout(() => {
        window.location.href = "/"; // Navigate to the home page
      }, 2000); // 2 seconds delay (adjust as needed)

    }, 800); 
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Error signing out. Please try again.","error");
      setIsProcessing(false);
    }
  };

  const handleNo = () => {
    navigate(-1); // Go back to previous page
  };

  if (isProcessing) {
    return (
      <div className="logout-container">
        <h2>Logging out...</h2>
        <p>Please wait while we sign you out.</p>
      </div>
    );
  }

  return (
    <div className="logout-container">
      <h2>Confirm Logout</h2>
      <p>Do you want to log out from Book in Hand Campaign?</p>
      <div className="logout-actions">
        <button className="btn-yes" onClick={handleYes}>Yes</button>
        <button className="btn-no" onClick={handleNo}>No</button>
      </div>
    </div>
  );
};

export default Logout;
