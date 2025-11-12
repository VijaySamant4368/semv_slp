import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./BookDetails.css";
import { showToast } from "../components/Toast";
import { getToken } from "../api";

const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch book details from backend
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = getToken()
        if (!token) {
          showToast("Please log in to view book details.", "warning");
          navigate("/login");
          return;
        }

        const res = await axios.get(`http://localhost:4000/api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBook(res.data);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId, navigate]);

  // Borrow handler (optional)
  const handleBorrow = async (bookId) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/borrows/request/${bookId}`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error requesting book");
    }
  };



  if (loading) return <p>Loading book details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className="bookdetails-container">
      <div className="bookdetails-header">
        <div>
          <img
            src={
              book.coverImage ||
              "https://via.placeholder.com/300x400?text=No+Cover+Available"
            }
            alt={book.title}
            className="book-details-cover"
          />
        </div>

        <div className="bookdetails-title">{book.title}</div>
        <div className="bookdetails-author">By: {book.author}</div>
      </div>

      <div className="bookdetails-section">
        <h3>Description</h3>
        <p>{book.description || "No description available."}</p>
      </div>

      <div className="bookdetails-actions">
        <button
          onClick={() => handleBorrow(book._id)}
          className="borrow-btn"
          disabled={book.status === "borrowed"}
        >
          {book.status === "borrowed" ? "Already Borrowed" : "Borrow Book"}
        </button>

        <button onClick={() => navigate("/books")} className="back-btn">
          Back to Books
        </button>
      </div>
    </div>
  );
};

export default BookDetails;
