// eslint-disable-next-line no-unused-vars
import API_BASE_URL from "../config";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // No token, redirect to login
      navigate("/login");
    } else {
      // Token exists, check user role
      checkUserRole(token);
    }
  });

  const checkUserRole = async (token) => {
    try {
      const response = await fetch("${API_BASE_URL}/admin/voters", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Admin user
        navigate("/admin");
      } else if (response.status === 403) {
        // Voter user
        navigate("/voter");
      } else {
        throw new Error("Failed to determine user role.");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      navigate("/login"); // Fallback to login in case of errors
    }
  };

  return (
    <div>
      <h2>Redirecting...</h2>
      <p>Please wait while we redirect you to the appropriate dashboard.</p>
    </div>
  );
};

export default HomePage;
