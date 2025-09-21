import './Homepage.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("");

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const logout = () => {
    localStorage.removeItem("userId"); // clear userId on logout
    alert("Logged out"); 
    setShowDropdown(false);
    navigate("/"); // redirect to login page
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      // fetch username from backend
      axios.get(`https://tailor-management-3.onrender.com/api/users/${userId}`)
        .then(res => setUsername(res.data.username))
        .catch(err => console.error("Error fetching user:", err));
    }
  }, []);

  return (
    <div className="whole">
      <div className="header">
        <div className="logoname" style={{ lineHeight: "2px" }}>
          <h1 style={{ color: 'Yellow', paddingLeft: 15 }}>ShopManGe</h1>
          <p style={{ paddingLeft: 15 }}>The Fashion Tailors</p>
        </div>

        <div className="user-profile">
          <div className="user-icon" onClick={toggleDropdown} title="Profile"></div>
          {showDropdown && (
            <div className="dropdown">
              <p>Hello, {username || "User"}</p>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="menubox">
        <button className="option" onClick={() => navigate('/DetailsPage')}>
          ADD DETAILS
        </button>
        <button className="option" onClick={() => navigate('/OrdersPage')}>
          ORDERS
        </button>
        <button className="option" onClick={() => navigate('/EarningsPage')}>
        EARNINGS
        </button>

      </div>
    </div>
  );
};

export default Home;
