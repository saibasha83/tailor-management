import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Loginpage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      if (isSignup) {
<<<<<<< HEAD
        
        await axios.post("https://tailor-management-3.onrender.com/api/users/signup", {
=======
        // SIGNUP
        await axios.post("http://localhost:5000/api/users/signup", {
>>>>>>> 748c428 (Implement JWT authentication and protect frontend/backend routes)
          username,
          password,
        });

        alert("Signup successful! Please login.");
        setIsSignup(false);
        setUsername("");
        setPassword("");
      } else {
<<<<<<< HEAD
        // Login API
        const res = await axios.post("https://tailor-management-3.onrender.com/api/users/login", {
=======
        // LOGIN
        const res = await axios.post("http://localhost:5000/api/users/login", {
>>>>>>> 748c428 (Implement JWT authentication and protect frontend/backend routes)
          username,
          password,
        });

        // STORE JWT + USER ID
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);

        setError("");
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="border w-25 mt-5 m-auto p-4">
      <h1 className="text-info text-center">
        {isSignup ? "Signup Form" : "Login Form"}
      </h1>

      <div>
        <input
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          type="text"
        />
      </div>

      <div className="mt-2">
        <input
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          type="password"
        />
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div className="mt-2">
        <button className="btn btn-primary w-100" onClick={handleSubmit}>
          {isSignup ? "Signup" : "Login"}
        </button>
      </div>

      <div className="text-center mt-2">
        <button
          className="btn btn-link"
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
        >
          {isSignup
            ? "Already have an account? Login"
            : "New user? Create an account"}
        </button>
      </div>
    </div>
  );
};

export default Loginpage;
