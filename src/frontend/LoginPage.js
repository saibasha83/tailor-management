import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Loginpage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false); // ✅ toggle login/signup
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        // ✅ Signup API
        await axios.post("http://localhost:5000/api/users/signup", {
          username,
          password,
        });
        alert("Signup successful! Please login.");
        setIsSignup(false);
      } else {
        // ✅ Login API
        const res = await axios.post("http://localhost:5000/api/users/login", {
          username,
          password,
        });
        if (res.data.userId) {
          localStorage.setItem("userId", res.data.userId); // store userId in localStorage
          navigate("/home");
        }
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

      {error && <span style={{ color: "red" }}>{error}</span>}

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
