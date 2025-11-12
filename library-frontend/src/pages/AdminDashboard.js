import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUser } from "../api";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const navigate = useNavigate();

  const token = getToken();
  const userData = getUser() ? JSON.parse(getUser()) : null;

  useEffect(() => {
    if (!token || !userData) return navigate("/login");
    if (userData.role !== "admin") return navigate("/login");

    fetchRequests();
    fetchBorrowedBooks();
  }, [token, userData, navigate]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/borrows", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/borrows/borrowed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBorrowedBooks(res.data);
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/borrows/update/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
      fetchBorrowedBooks();
      alert(`Request ${status} successfully`);
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
      fetchBorrowedBooks();
      alert("Book returned successfully");
    } catch (err) {
      console.error("Error returning book:", err);
      alert(err.response?.data?.message || "Error returning book");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Borrow Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        requests.map((r) => (
          <div key={r._id} className="request-card">
            <p>
              <strong>{r.userId?.name}</strong> requested <em>{r.bookId?.title}</em> - Status: {r.status}
            </p>
            {r.status === "pending" && r.bookId?.status !== "borrowed" && (
              <>
                <button onClick={() => handleAction(r._id, "approved")}>Approve</button>
                <button onClick={() => handleAction(r._id, "rejected")}>Reject</button>
              </>
            )}
            {r.status === "pending" && r.bookId?.status === "borrowed" && (
              <p style={{ color: "red" }}>Book already borrowed</p>
            )}
          </div>
        ))
      )}

      <h2>Borrowed Books</h2>
      {borrowedBooks.length === 0 ? (
        <p>No books currently borrowed.</p>
      ) : (
        borrowedBooks.map((b) => (
          <div key={b._id} className="request-card">
            <p>
              <strong>{b.borrower?.name}</strong> borrowed <em>{b.book?.title}</em>
            </p>
            <button onClick={() => handleReturn(b._id)}>Mark as Returned</button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
