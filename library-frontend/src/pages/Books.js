import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Books.css";
import { useNavigate } from "react-router-dom";
import { getToken } from "../api";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const fetchBooks = async () => {
    try {
      const token = getToken()
      const res = await axios.get("http://localhost:4000/api/books", {
        headers: { Authorization: `Bearer ${token}` },
        params: search ? { search } : {},
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-text">Loading books...</p>;

  return (
    <div className="books-container">
      {/* 🔍 Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h2>Available Books</h2>

      {/* 📖 Book List */}
      <div className="book-list">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} className="book-card">
              <div className="book-cover-div">

              <img
              src={
                book.coverImage ||
                "https://via.placeholder.com/150?text=No+Cover"
              }
              alt={book.title}
              className="book-cover"
            />
            </div>
              <h3>{book.title}</h3>
              <p>By {book.author}</p>
              <p className="status">Status: {book.status}</p>
              <button onClick={() => navigate(`/books/${book._id}`)}>View</button>
            </div>
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Books;
