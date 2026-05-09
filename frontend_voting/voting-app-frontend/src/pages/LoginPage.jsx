// eslint-disable-next-line no-unused-vars
import API_BASE_URL from "../config";
import React, { useState } from "react";
import './../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      // Step 1: Login and retrieve token
      const loginResponse = await fetch(`${API_BASE_URL}/voters/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const token = await loginResponse.text();
      localStorage.setItem("token", token);

      // Step 2: Check if the user has admin access
      const roleResponse = await fetch(`${API_BASE_URL}/admin/voters`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (roleResponse.ok) {
        // User is an admin
        window.location.href = "/admin";
      } else if (roleResponse.status === 403) {
        // User is a voter (non-admin)
        window.location.href = "/voter";
      } else {
        throw new Error("Failed to determine user role.");
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <div className="form-group">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
