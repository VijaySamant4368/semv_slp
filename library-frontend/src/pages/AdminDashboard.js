import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUser } from "../api";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [donationRequests, setDonationRequests] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const navigate = useNavigate();

  const token = getToken();
  const userData = getUser() ? JSON.parse(getUser()) : null;

  useEffect(() => {
    if (!token || !userData) return navigate("/login");
    if (userData.role !== "admin") return navigate("/login");
    fetchData();
  }, [token, navigate]);

const fetchData = async () => {
  try {
    // Fetch Borrow Requests
    const borrowRes = await axios.get("http://localhost:4000/api/borrows", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const pendingBorrowRequests = borrowRes.data
      .filter((r) => r.status === "pending")
      .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)); 
    
    const nonPendingBorrowRequests = borrowRes.data
      .filter((r) => r.status !== "pending")
      .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)); 
    
    const sortedBorrowRequests = [...pendingBorrowRequests, ...nonPendingBorrowRequests];
    setRequests(sortedBorrowRequests.slice(0, 5)); 

    const donationRes = await axios.get("http://localhost:4000/api/donation-requests", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const pendingDonationRequests = donationRes.data
      .filter((d) => d.status === "pending")
      .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)); 
    
    const nonPendingDonationRequests = donationRes.data
      .filter((d) => d.status !== "pending")
      .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)); 
    
    const sortedDonationRequests = [...pendingDonationRequests, ...nonPendingDonationRequests];
    setDonationRequests(sortedDonationRequests.slice(0, 5));

    const borrowedRes = await axios.get(
      "http://localhost:4000/api/borrows/borrowed",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setBorrowedBooks(borrowedRes.data.slice(0, 10)); 
  } catch (err) {
    console.error("Error fetching admin data:", err);
  }
};



  const handleAction = async (id, status, type) => {
    try {
      if (type === "borrow") {
        await axios.patch(
          `http://localhost:4000/api/borrows/update/${id}`,
          { status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`Borrow request ${status} successfully`);
        fetchData();
        
      } else if (type === "donation") {
        const actionUrl = `http://localhost:4000/api/donation-requests/${status.toLowerCase()}/${id}`;
        const response = await axios.patch(actionUrl, {}, { headers: { Authorization: `Bearer ${token}` } });
        alert(`Donation request ${status} successfully`);
        fetchData(); 
      }
    } catch (err) {
      console.error("Error updating request:", err);
      alert(err.response?.data?.message || "Error updating request");
    }
  };


  const handleReturn = async (borrowId) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/borrows/return/${borrowId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
      alert("Book returned successfully");
    } catch (err) {
      console.error("Error returning book:", err);
      alert(err.response?.data?.message || "Error returning book");
    }
  };

  return (
  <div className="admin-dashboard">

    <div className="dashboard-grid">

      {/* Borrow Requests */}
      <div className="section-card">
        <h3>Borrow Requests</h3>

        {requests.length === 0 ? (
          <p className="empty-text">No borrow requests</p>
        ) : (
          requests.map((r) => (
            <div key={r._id} className="item">
              <span className="item-title">{r.bookId?.title}</span>

              {r.status === "pending" ? (
                <button
                  className="action-btn approve-btn"
                  onClick={() => handleAction(r._id, "approved", "borrow")}
                >
                  Approve
                </button>
              ) : (
                <span className={`status-badge status-${r.status}`}>
                  {r.status}
                </span>
              )}
            </div>
          ))
        )}

        <button className="view-more-btn" onClick={() => navigate("/borrow-requests")}>
          View More
        </button>
      </div>

      {/* Donation Requests */}
      <div className="section-card">
        <h3>Donation Requests</h3>

        {donationRequests.length === 0 ? (
          <p className="empty-text">No donation requests</p>
        ) : (
          donationRequests.map((d) => (
            <div key={d._id} className="item">
              <span className="item-title">{d.title}</span>

              {d.status === "pending" ? (
                <div>
                  <button
                    className="action-btn approve-btn"
                    onClick={() => handleAction(d._id, "approved", "donation")}
                  >
                    Approve
                  </button>
                  <button
                    className="action-btn reject-btn"
                    onClick={() => handleAction(d._id, "rejected", "donation")}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span className={`status-badge status-${d.status}`}>
                  {d.status}
                </span>
              )}
            </div>
          ))
        )}

        <button className="view-more-btn" onClick={() => navigate("/donation-requests")}>
          View More
        </button>
      </div>

      {/* Currently Borrowed */}
      <div className="section-card">
        <h3>Currently Borrowed</h3>

        {borrowedBooks.length === 0 ? (
          <p className="empty-text">No borrowed books</p>
        ) : (
          borrowedBooks.map((b) => (
            <div key={b._id} className="item">
              <span className="item-title">{b.book?.title}</span>
              <button
                className="action-btn return-btn"
                onClick={() => handleReturn(b._id)}
              >
                Return
              </button>
            </div>
          ))
        )}

        <button className="view-more-btn" onClick={() => navigate("/borrowed-books")}>
          View More
        </button>
      </div>

    </div>
  </div>
);
};

export default AdminDashboard;
