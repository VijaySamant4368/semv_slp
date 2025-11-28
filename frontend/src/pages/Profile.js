import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUser } from "../api";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track if the user is editing
  const [updatedUser, setUpdatedUser] = useState({ name: "", email: "" }); // Store the updated user info

  useEffect(() => {
  const token = getToken(); // Get the latest token
  const storedUser = JSON.parse(getUser()); // Get the latest user data

  if (!token || !storedUser) {
    setError("No user logged in");
    return;
  }

  const config = { headers: { Authorization: `Bearer ${token}` } };
  const id = storedUser.id;

  // Fetch the user info from the backend
  axios
    .get(`http://localhost:4000/api/members/${id}`, config)
    .then((res) => setUser(res.data)) // Set the user state
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



  const handleEditClick = () => {
    setIsEditing(true);
    setUpdatedUser({
      name: user.name,
      email: user.email,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({
      ...updatedUser,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = getToken();
  const storedUser = JSON.parse(getUser());

  if (!token || !storedUser) {
    setError("No user logged in");
    return;
  }

  const config = { headers: { Authorization: `Bearer ${token}` } };
  const id = storedUser.id;

  try {
    // Make the API request to update the user profile
    const res = await axios.put(
      `http://localhost:4000/api/members/${id}`,
      updatedUser,
      config
    );
    
    // Update the user state with the new data after successful update
    setUser(res.data);

    // Optionally: Update the local storage with the updated user data
    localStorage.setItem("user", JSON.stringify(res.data));  // Assuming you store the user info in localStorage

    // Close the editing form
    setIsEditing(false); 
    setError(null);
    window.location.reload()
  } catch (err) {
    setError("Failed to update profile");
  }
};


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

      {!isEditing ? (
        <button className="edit-profile" onClick={handleEditClick}>
          Edit Profile
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="edit-form">
          <h3>Edit Profile</h3>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={updatedUser.name}
            onChange={handleInputChange}
            required
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      )}

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
