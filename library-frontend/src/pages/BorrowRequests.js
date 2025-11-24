import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../api";
import "./AdminDashboard.css";

const BorrowRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // <-- added
  const token = getToken();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/borrows", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pending = res.data
          .filter((r) => r.status === "pending")
          .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));

        const nonPending = res.data
          .filter((r) => r.status !== "pending")
          .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));

        setRequests([...pending, ...nonPending]);
      } catch (err) {
        console.error("Error fetching borrow requests:", err);
      }
    };

    fetchRequests();
  }, [token]);

  // FILTER LOGIC — name or phone
  const filteredRequests = requests.filter((r) => {
    const name = r.userId?.name?.toLowerCase() || "";
    const phone = r.userId?.phone || "";
    const search = searchTerm.toLowerCase();

    return name.includes(search) || phone.includes(search);
  });

  return (
    <div className="admin-dashboard">
      <h2>All Borrow Requests</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or phone..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid-container">
        {filteredRequests.length === 0 ? (
          <p className="empty-text">No borrow requests found.</p>
        ) : (
          filteredRequests.map((r) => (
            <div key={r._id} className="view-card">
              <h3 className="card-title">{r.bookId?.title}</h3>

              <p className="card-line">
                <strong>{r.userId?.name}</strong> ({r.userId?.phone}) requested{" "}
                <em>{r.bookId?.title}</em>
              </p>

              {r.status === "pending" ? (
                <button
                  className="approve-btn"
                  onClick={async () => {
                    try {
                      await axios.patch(
                        `http://localhost:4000/api/borrows/update/${r._id}`,
                        { status: "approved" },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );

                      setRequests((prev) =>
                        prev.map((item) =>
                          item._id === r._id
                            ? { ...item, status: "approved" }
                            : item
                        )
                      );
                    } catch (err) {
                      console.error("Approval failed:", err);
                    }
                  }}
                >
                  Approve
                </button>
              ) : (
                <span className="status-approved">Approved</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BorrowRequests;
