// src/pages/EarningsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EarningsPage.css";

const EarningsPage = () => {
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  axios
    .get(`https://tailor-management-3.onrender.com/api/earnings?userId=${userId}`)
    .then((res) => setEarnings(res.data))
    .catch((err) => console.error(err));
}, []);


  return (
    <div className="earnings-container">
      <h2 className="earnings-title">Daily Earnings</h2>

      {earnings.length === 0 ? (
        <p className="no-data">No earnings data available</p>
      ) : (
        <div className="table-wrapper">
          <table className="earnings-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Earnings (₹)</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((day) => (
                <tr key={day.date}>
                  <td>{day.date}</td>
                  <td>₹{day.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EarningsPage;
