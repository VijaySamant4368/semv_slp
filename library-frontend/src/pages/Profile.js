import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUser } from "../api";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();
    const storedUser = JSON.parse(getUser());

    if (!token || !storedUser) {
      setError("No user logged in");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const id = storedUser.id;

    axios
      .get(`http://localhost:4000/api/members/${id}`, config)
      .then((res) => setUser(res.data))
      .catch(() => setError("Failed to load user info"));

    axios
      .get(`http://localhost:4000/api/members/${id}/borrows`, config)
      .then((res) => setBorrows(res.data))
      .catch(() => console.error("Error fetching borrows"));

    axios
      .get(`http://localhost:4000/api/members/${id}/donations`, config)
      .then((res) => setDonations(res.data))
      .catch(() => console.error("Error fetching donations"));
  }, []);

  if (error) return <p className="error-text">{error}</p>;
  if (!user) return <p className="loading-text">Loading profile...</p>;

  // 🎲 Generate a random but consistent avatar for each user
  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
    user.name || user.email
  )}`;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={avatarUrl}
          alt="Profile Avatar"
          className="profile-avatar"
        />
        <h2>{user.name}</h2>
        <p className="profile-email">{user.email}</p>
      </div>

      <button className="edit-profile">Edit Profile</button>

      <div className="profile-section">
        <h3>Books Donated</h3>
        {donations.length > 0 ? (
          <table className="profile-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date Donated</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d._id}>
                  <td>{d.book?.title || "Unknown Title"}</td>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No donation history yet.</p>
        )}
      </div>

      <div className="profile-section">
        <h3>Books Borrowed</h3>
        {borrows.length > 0 ? (
          <table className="profile-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Date Borrowed</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((b) => (
                <tr key={b._id}>
                  <td>{b.book?.title || "Unknown Title"}</td>
                  <td>
                    <span
                      className={`badge ${
                        b.status === "returned" ? "available" : "borrowed"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No borrowed books yet.</p>
        )}
      </div>

      <div className="profile-footer">
        <div>Thank you for being part of the Book in Hand Campaign 📚</div>
        <div className="profile-social">
          <i className="fab fa-facebook"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-instagram"></i>
        </div>
      </div>
    </div>
  );
};

export default Profile;
