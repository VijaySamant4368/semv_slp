import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../api";
import "./AdminDashboard.css";

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const token = getToken();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/donation-requests", {
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
        console.error("Error:", err);
      }
    };

    fetchRequests();
  }, [token]);

  return (
    <div className="admin-dashboard">
      <h2>All Donation Requests</h2>

      <div className="grid-container">
        {requests.length === 0 ? (
          <p className="empty-text">No donation requests available.</p>
        ) : (
          requests.map((d) => (
            <div key={d._id} className="view-card">
              <h3 className="card-title">{d.title}</h3>

              {/* <p className="card-line">
                <strong>{d.donor?.name}</strong> wants to donate <em>{d.title}</em>
              </p> */}
              <p className="card-line">
                <strong>{d.donor?.name}</strong> ({d.donor?.phone})
                wants to donate <em>{d.title}</em>
              </p>

              {d.status === "pending" ? (
                <button
                  className="approve-btn"
                  onClick={async () => {
                    try {
                      await axios.patch(
                        `http://localhost:4000/api/donation-requests/approved/${d._id}`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                      );

                      setRequests((prev) =>
                        prev.map((item) =>
                          item._id === d._id ? { ...item, status: "approved" } : item
                        )
                      );
                    } catch (err) {
                      console.error("Error approving donation:", err);
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

export default DonationRequests;
