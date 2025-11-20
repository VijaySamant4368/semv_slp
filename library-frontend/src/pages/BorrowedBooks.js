import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../api";
import "./AdminDashboard.css";

const BorrowedBooks = () => {
  const [books, setBooks] = useState([]);
  const token = getToken();

  useEffect(() => {
    const fetchBorrowed = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/borrows/borrowed",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching borrowed books:", err);
      }
    };

    fetchBorrowed();
  }, [token]);

  // Handle return book
  const handleReturn = async (id) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/borrows/return/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBooks((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "returned" } : item
        )
      );
    } catch (err) {
      console.error("Error returning book:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>All Borrowed Books</h2>

      <div className="grid-container">
        {books.length === 0 ? (
          <p className="empty-text">No books currently borrowed.</p>
        ) : (
          books.map((b) => (
            <div key={b._id} className="view-card">

              <h3 className="card-title">{b.book?.title}</h3>

              <p className="card-line">
                <strong>{b.borrower?.name}</strong> borrowed{" "}
                <em>{b.book?.title}</em>
              </p>

              <div className="request-actions">
                {b.status !== "returned" ? (
                  <button
                    className="approve-btn"
                    onClick={() => handleReturn(b._id)}
                  >
                    Return
                  </button>
                ) : (
                  <span className="status-returned">Returned</span>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BorrowedBooks;
