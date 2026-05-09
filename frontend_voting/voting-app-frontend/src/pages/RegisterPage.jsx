// eslint-disable-next-line
import React, { useState } from "react";
import "./../styles/Registration.css";

const VoterRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false, // Default value set to false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await fetch("/api/voters/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(errorDetails || "Failed to register voter");
      }

      setSuccess("Voter registered successfully!");
      setFormData({ name: "", email: "", password: "", isAdmin: false }); // Reset form
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="registration-page">
      <h2>Register as a New Voter</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit} className="registration-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default VoterRegistration;
