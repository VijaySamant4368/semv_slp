import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./BookDetails.css";
import { showToast } from "../components/Toast";
import { getToken, getUser } from "../api";

const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // DEBUG: show these in console to trace where the request goes
  useEffect(() => {
    console.log("BookDetails mounted — bookId:", bookId);
  }, [bookId]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = getToken();
        console.log("Fetching book — token present?:", !!token, "bookId:", bookId);

        if (!token) {
          showToast("Please log in to view book details.", "warning");
          navigate("/login");
          return;
        }

        if (!bookId) {
          setError("Invalid book ID (no id provided in URL).");
          setLoading(false);
          return;
        }

        const url = `http://localhost:4000/api/books/${bookId}`;
        console.log("BookDetails: GET", url);

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Book details response:", res.status, res.data);
        setBook(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching book details:", err);

        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);

          if (err.response.status === 404) {
            setError("Book not found (404). Either the book doesn't exist or the ID is wrong.");
          } else if (err.response.status === 401 || err.response.status === 403) {
            setError("Unauthorized. Please login and try again.");

          } else {
            setError(err.response.data?.message || "Server returned an error.");
          }
        } else if (err.request) {
          setError("No response from server. Is backend running and accessible at http://localhost:4000?");
        } else {

          setError("Error: " + (err.message || "Unknown error"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId, navigate]);

  const handleBorrow = async (bookId) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/borrows/request/${bookId}`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      showToast(res.data.message, "success");
      navigate("/books", { state: { refresh: true } });

    } catch (err) {
      console.error("Borrow error:", err);
      showToast(err.response?.data?.message || "Error requesting book","error");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      showToast("Book deleted successfully", "success");
      navigate("/books", { state: { refresh: true } });
    } catch (err) {
      console.error("Delete error:", err);
      showToast(err.response?.data?.message || "Error deleting book", "error");
    }
  };

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!book) return <p>Book not found.</p>;

  const userRole = (() => {
    try {
      const userRaw = getUser();
      if (userRaw) return JSON.parse(userRaw).role;
    } catch (e) { }
    return null;
  })();

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
        <h3>Synopsis</h3>
        <p>{book.description || "No description available."}</p>
      </div>

      <div className="bookdetails-actions">

        {userRole === "admin" && (
          <button onClick={handleDelete} className="delete-btn">
            Delete Book
          </button>
        )}

        {userRole === "member" && (
          <button
            onClick={() => handleBorrow(book._id)}
            className="borrow-btn"
            disabled={book.status === "borrowed"}
          >
            {book.status === "borrowed" ? "Already Borrowed" : "Borrow Book"}
          </button>
        )}

        <button onClick={() => navigate("/books")} className="back-btn">
          Back to Books
        </button>
      </div>

    </div>
  );
};

export default BookDetails;
