import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUser } from "../api";
import "./AdminProfile.css";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);

  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [acceptedBorrows, setAcceptedBorrows] = useState([]);
  const [acceptedReturns, setAcceptedReturns] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(getUser());
    setAdmin(userData);

    fetchAcceptedRequests();
  }, []);

  const fetchAcceptedRequests = async () => {
    const token = getToken();

    try {
      const donationRes = await axios.get(
        "http://localhost:5000/api/admin/accepted-donations",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const borrowRes = await axios.get(
        "http://localhost:5000/api/admin/accepted-borrows",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const returnRes = await axios.get(
        "http://localhost:5000/api/admin/accepted-returns",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAcceptedDonations(donationRes.data);
      setAcceptedBorrows(borrowRes.data);
      setAcceptedReturns(returnRes.data);
    } catch (error) {
      console.log("Error fetching accepted requests", error);
    }
  };

  return (
    <div className="admin-profile-container">
      {/* HEADER */}
      <div className="admin-header">
        <img
          src={admin?.avatar || "https://i.ibb.co/4pDNDk1/avatar.png"}
          alt="Admin Avatar"
          className="admin-avatar"
        />
        <h2>{admin?.name}</h2>
        <p className="admin-role-text">Admin</p>
      </div>

      {/* STATS GRID */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <p className="admin-stat-title">Donation Requests Accepted</p>
          <p className="admin-stat-value">{acceptedDonations.length}</p>
        </div>

        <div className="admin-stat-card">
          <p className="admin-stat-title">Borrow Requests Accepted</p>
          <p className="admin-stat-value">{acceptedBorrows.length}</p>
        </div>

        <div className="admin-stat-card">
          <p className="admin-stat-title">Return Requests Accepted</p>
          <p className="admin-stat-value">{acceptedReturns.length}</p>
        </div>
      </div>

      {/* DONATION ACCEPTED TABLE */}
      <div className="admin-section">
        <h3>Donation Requests Accepted</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>User</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {acceptedDonations.map((req, index) => (
              <tr key={index}>
                <td>{req.bookName}</td>
                <td>{req.userName}</td>
                <td>{new Date(req.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BORROW ACCEPTED TABLE */}
      <div className="admin-section">
        <h3>Borrow Requests Accepted</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>User</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {acceptedBorrows.map((req, index) => (
              <tr key={index}>
                <td>{req.bookName}</td>
                <td>{req.userName}</td>
                <td>{new Date(req.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RETURN ACCEPTED TABLE */}
      <div className="admin-section">
        <h3>Return Requests Accepted</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>User</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {acceptedReturns.map((req, index) => (
              <tr key={index}>
                <td>{req.bookName}</td>
                <td>{req.userName}</td>
                <td>{new Date(req.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="admin-footer">
        <p>Book in Hand Campaign © 2025</p>
      </div>
    </div>
  );
};

export default AdminProfile;