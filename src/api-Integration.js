import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = 'http://localhost:5000/usersdata';

function UserForm() {
  const [formData, setFormData] = useState({ name: '', age: '', email: '' });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch users from backend using fetch() method
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send
    const payload = {
      name: formData.name,
      age: formData.age ? Number(formData.age) : null,
      email: formData.email,
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save user');
      }

      setFormData({ name: '', age: '', email: '' });
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Enter User Data</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <h2 style={{ marginTop: 30 }}>Stored Users</h2>
      {loading && <p>Loading users...</p>}
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name} ({user.age ?? 'N/A'} years) - {user.email}
          </li>
        ))}
      </ul>
      
    </div>
  );
}

export default UserForm;
