import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddBook.css";
import { getToken } from "../api";

const AddBook = () => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    genres: "",
    description: "",
  });

  const [donorName, setDonorName] = useState(""); // 👈 store name
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch donor details using token
    axios
      .get("http://localhost:4000/api/members/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDonorName(res.data.name))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token=getToken();
    
    if (!token) {
    
      setMessage("⚠️ Please log in to donate a book.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/books",
        {
          title: book.title,
          author: book.author,
          genres: book.genres
            ? book.genres.split(",").map((g) => g.trim())
            : [],
          description: book.description,
          donorName, // 👈 send name too
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || "Book donated successfully ✅");
      setBook({ title: "", author: "", genres: "", description: "" });
    } catch (err) {
      console.error("Error donating book:", err);
      setMessage(err.response?.data?.message || "Failed to donate book ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addbook-container">
      <form className="addbook-form" onSubmit={handleSubmit}>
        <h2>Donate a Book</h2>

        <label>Book Title</label>
        <input
          type="text"
          name="title"
          value={book.title}
          onChange={handleChange}
          placeholder="Enter book title"
          required
        />

        <label>Author</label>
        <input
          type="text"
          name="author"
          value={book.author}
          onChange={handleChange}
          placeholder="Enter author's name"
          required
        />

        <label>Genres (comma-separated)</label>
        <input
          type="text"
          name="genres"
          value={book.genres}
          onChange={handleChange}
          placeholder="e.g. Fiction, Mystery"
        />

        <label>Description</label>
        <textarea
          name="description"
          value={book.description}
          onChange={handleChange}
          placeholder="Add a short description"
          rows="4"
        ></textarea>

        {donorName && (
          <p style={{ fontStyle: "italic", color: "#2d6cdf" }}>
            Logged in as: {donorName}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Book"}
        </button>

        {message && (
          <p
            style={{
              color: message.includes("success") ? "green" : "red",
              marginTop: "10px",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddBook;
