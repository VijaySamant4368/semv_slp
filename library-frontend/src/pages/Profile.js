import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUser } from "../api";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken()
    const storedUser = JSON.parse(getUser());

    if (!token || !storedUser) {
      setError("No user logged in");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const id = storedUser.id;

    console.log("🔍 Fetching profile for user:", id);

    axios
      .get(`http://localhost:4000/api/members/${id}`, config)
      .then((res) => {
        console.log("✅ User data:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching user:", err);
        setError("Failed to load user info");
      });

    axios
      .get(`http://localhost:4000/api/members/${id}/borrows`, config)
      .then((res) => {
        console.log("✅ Borrow history:", res.data);
        setBorrows(res.data);
      })
      .catch((err) => console.error("❌ Error fetching borrows:", err));

    axios
      .get(`http://localhost:4000/api/members/${id}/donations`, config)
      .then((res) => {
        console.log("✅ Donation history:", res.data);
        setDonations(res.data);
      })
      .catch((err) => console.error("❌ Error fetching donations:", err));
  }, []);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <h1>{user.name}'s Profile</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>

      <h2>Books Donated</h2>
      <ul>{donations.map((d) => <li key={d._id}>{d.book?.title}</li>)}</ul>

      <h2>Books Borrowed</h2>
      <ul>{borrows.map((b) => <li key={b._id}>{b.book?.title}</li>)}</ul>
    </div>
  );
};

export default Profile;
