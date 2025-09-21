import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./myorders.module.css";

const MyOrders = () => {
  const [garments, setGarments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editMeasurements, setEditMeasurements] = useState({});
  const [editSubmitDate, setEditSubmitDate] = useState("");
  const [editStatus, setEditStatus] = useState("Pending");
  const [editCost, setEditCost] = useState(null);
  const [editPhoneNumber, setEditPhoneNumber] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) fetchGarments(userId);
  }, [userId]);

  const fetchGarments = async (userId) => {
    try {
      const res = await axios.get(`https://tailor-management-3.onrender.com/api/garments/user/${userId}`);
      setGarments(res.data);
    } catch (error) {
      console.error("Error fetching garments:", error);
    }
  };

  // Filter garments by search and status
  const filteredGarments = garments.filter((g) => {
    const matchesSearch = g._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this garment?")) return;
    try {
      await axios.delete(`https://tailor-management-3.onrender.com/api/garments/${id}`);
      setGarments((prev) => prev.filter((g) => g._id !== id));
    } catch (error) {
      console.error("Error deleting garment:", error);
    }
  };

  const handleEdit = (garment) => {
    setEditingId(garment._id);
    setEditMeasurements(garment.measurements);
    setEditSubmitDate(garment.submitDate?.split("T")[0] || "");
    setEditStatus(garment.status || "Pending");
    setEditCost(garment.cost);
    setEditPhoneNumber(garment.phoneNumber || "");
  };

  // ✅ Updated Save logic
  const handleSave = async (id) => {
    try {
      if (editStatus === "Completed") {
        // Call special status route → sends SMS
        await axios.put(`https://tailor-management-3.onrender.com/api/garments/${id}/status`, {
          status: "Completed",
        });
      } else {
        // Normal update
        await axios.put(`https://tailor-management-3.onrender.com/api/garments/${id}`, {
          measurements: editMeasurements,
          submitDate: editSubmitDate,
          status: editStatus,
          cost: editCost,
          phoneNumber: editPhoneNumber,
          userId,
        });
      }

      // Refresh garments list after save
      fetchGarments(userId);
      setEditingId(null);
      alert("✅ Garment updated successfully!");
    } catch (error) {
      console.error("Error updating garment:", error);
      alert("❌ Failed to update garment");
    }
  };

  // Sort garments: Pending first
  const sortedGarments = [...filteredGarments].sort((a, b) => {
    if (a.status === b.status) return 0;
    if (a.status === "Pending") return -1;
    if (b.status === "Pending") return 1;
    return 0;
  });

  return (
    <div className={styles.container}>
      <h2>My Saved Garments</h2>

      {/* Search & Status Filter */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by Garment ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control mb-2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-select mb-3"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {sortedGarments.length === 0 ? (
        <p>No garments found.</p>
      ) : (
        <div className={styles.ordersList}>
          {sortedGarments.map((g) => (
            <div
              key={g._id}
              className={`${styles.orderCard} ${
                g.status?.toLowerCase() === "completed"
                  ? styles.completed
                  : styles.pending
              } ${
                g.submitDate &&
                new Date(g.submitDate).toDateString() === new Date().toDateString()
                  ? styles.dueToday
                  : ""
              }`}
            >
              <h3>{g.garmentType}</h3>

              {/* Measurements */}
              {editingId === g._id ? (
                Object.entries(editMeasurements).map(([k, v]) => (
                  <div key={k} className={styles.measurementInput}>
                    <label>
                      {k}:{" "}
                      <input
                        type="text"
                        value={v}
                        onChange={(e) =>
                          setEditMeasurements((prev) => ({ ...prev, [k]: e.target.value }))
                        }
                      />
                    </label>
                  </div>
                ))
              ) : (
                <ul className={styles.measurementList}>
                  {Object.entries(g.measurements).map(([k, v]) => (
                    <li key={k}>
                      <strong>{k}:</strong> {v}
                    </li>
                  ))}
                </ul>
              )}

              {/* Submit Date */}
              <p>
                <strong>Submit Date:</strong>{" "}
                {editingId === g._id ? (
                  <input
                    type="date"
                    value={editSubmitDate}
                    onChange={(e) => setEditSubmitDate(e.target.value)}
                  />
                ) : (
                  formatDate(g.submitDate)
                )}
              </p>

              {/* Created At */}
              <p>
                <strong>Created At:</strong> {formatDate(g.createdAt)}
              </p>

              {/* Cost */}
              <p>
                <strong>Cost: </strong>
                {editingId === g._id ? (
                  <input
                    type="number"
                    value={editCost || ""}
                    onChange={(e) => setEditCost(e.target.value)}
                    placeholder="Enter cost"
                    style={{ width: "80px", marginLeft: "5px" }}
                  />
                ) : (
                  `${g.cost} Rs`
                )}
              </p>

              {/* Phone Number */}
              <p>
                <strong>Phone Number:</strong>{" "}
                {editingId === g._id ? (
                  <input
                    type="tel"
                    value={editPhoneNumber}
                    onChange={(e) => setEditPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    style={{ width: "150px", marginLeft: "5px" }}
                  />
                ) : (
                  g.phoneNumber || "N/A"
                )}
              </p>

              {/* Status */}
              <p>
                <strong>Status:</strong>{" "}
                {editingId === g._id ? (
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  <span
                    className={`${styles.statusBadge} ${
                      g.status?.toLowerCase() === "completed"
                        ? styles.completed
                        : styles.pending
                    }`}
                  >
                    {g.status || "Pending"}
                  </span>
                )}
              </p>

              {/* Actions */}
              <div className={styles.actionButtons}>
                {editingId === g._id ? (
                  <>
                    <button className={styles.saveBtn} onClick={() => handleSave(g._id)}>
                      Save
                    </button>
                    <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles.editBtn} onClick={() => handleEdit(g)}>
                      Modify
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(g._id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
