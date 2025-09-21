import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './garmentForm.module.css';

const GarmentForm = () => {
  const { garmentType } = useParams();
  const navigate = useNavigate();

  const garmentFields = {
    shirt: ["length", "chest", "waist", "sleeve", "shoulder"],
    pant: ["length", "waist", "hip", "thigh", "bottom"],
    kurta: ["length", "chest", "waist", "sleeve", "shoulder"],
    blazer: ["length", "chest", "waist", "shoulder", "sleeve"],
    suit: ["length", "chest", "waist", "shoulder", "sleeve"],
    sherwani: ["length", "chest", "waist", "sleeve", "shoulder"],
    jacket: ["length", "chest", "waist", "shoulder"],
    tshirt: ["length", "chest", "waist", "sleeve"],
    jeans: ["length", "waist", "hip", "thigh", "bottom"]
  };

  const initialMeasurements =
    garmentFields[garmentType]?.reduce((acc, field) => {
      acc[field] = "";
      return acc;
    }, {}) || {};

  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [submitDate, setSubmitDate] = useState("");
  const [cost, setCost] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // ✅ new state

  const handleChange = (e) => {
    const { id, value } = e.target;
    setMeasurements((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/garments", {
        garmentType,
        measurements,
        submitDate,
        cost,
        phoneNumber, // ✅ sending phone number
        userId: localStorage.getItem("userId"),
      });
      alert(`${garmentType} measurements saved`);
      navigate("/DetailsPage");
    } catch (error) {
      console.error(error);
      alert("Error saving data to database!");
    }
  };

  return (
    <div className={styles.container}>
      <h2>
        {garmentType.charAt(0).toUpperCase() + garmentType.slice(1)} Measurements
      </h2>
      <form onSubmit={handleSubmit}>
        {garmentFields[garmentType]?.map((field) => (
          <div key={field}>
            <label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type="text"
              id={field}
              value={measurements[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div>
          <label htmlFor="submitDate">Date to Submit:</label>
          <input
            type="date"
            id="submitDate"
            value={submitDate}
            onChange={(e) => setSubmitDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Cost in Rs:</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Customer Phone Number:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default GarmentForm;
