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

  const [coverImage, setCoverImage] = useState(null);
  const [donorName, setDonorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;

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

  const handleImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = getToken();
    if (!token) {
      setMessage("⚠️ Please log in to donate a book.");
      setLoading(false);
      return;
    }

    try {
      let imageUrl = "";

      if (coverImage) {
        const formData = new FormData();
        formData.append("file", coverImage);
        formData.append("upload_preset", "book_cover"); 

        const cloudRes = await axios.post(
          `https://api.cloudinary.com/v1_1/dtk12thvk/image/upload`,
          formData
        );

        imageUrl = cloudRes.data.secure_url;
      }
      const res = await axios.post(
        "http://localhost:4000/api/books",
        {
          title: book.title,
          author: book.author,
          genres: book.genres
            ? book.genres.split(",").map((g) => g.trim())
            : [],
          description: book.description,
          donorName,
          coverImage: imageUrl, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || "Book donated successfully ");
      setBook({ title: "", author: "", genres: "", description: "" });
      setCoverImage(null);
    } catch (err) {
      console.error("Error donating book:", err);
      setMessage(err.response?.data?.message || "Failed to donate book ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addbook-container">
      <div className="side-text">
  Every donated book finds a new reader, sparks inspiration,
  and brings knowledge into someone’s hands.
</div>
<div className="decor-circle"></div>
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

        <label>Book Cover Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {coverImage && (
          <img
            src={URL.createObjectURL(coverImage)}
            alt="Preview"
            style={{ width: "120px", marginTop: "10px", borderRadius: "8px" }}
          />
        )}

        {donorName && (
          <p style={{ fontStyle: "italic", color: "#2d6cdf" }}>
            Logged in as: {donorName}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Add Book"}
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
<div className="image-gallery">
        <img src="image1_url" alt="image1" />
        <img src="image2_url" alt="image2" />
        <img src="image3_url" alt="image3" />
        <img src="image4_url" alt="image4" />
      </div>

    </div>
  );
};

export default AddBook;
