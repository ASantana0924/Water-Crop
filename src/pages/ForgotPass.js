import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPass() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendPasswordReset = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      window.alert("Password reset email sent successfully");
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error(error);
      window.alert("Error: " + error.message);
      // Handle different cases, e.g., user not found, email not verified, etc.
    }
  };

  return (
    <div className="forgot-pass-container" style={{ backgroundColor: "#9cc599", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <form onSubmit={sendPasswordReset} style={{ maxWidth: "400px", margin: "auto", padding: "55px", borderRadius: "10px", background: "#fff" }}>
        <h1 style={{ textAlign: "center", fontSize: "44px", fontWeight: "bold", marginTop: "40px", marginBottom: "40px" }}>
          WaterCrop
        </h1>
        <h2 style={{ marginBottom: "35px", fontSize: "30px" }}>Forgot Password?</h2>
        <label htmlFor="email" style={{ textAlign: "left", display: "block", marginBottom: "5px", fontSize: "16px" }}>Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "40px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#4d814a", color: "#fff", border: "none", borderRadius: "5px" }}>
          Send Email
        </button>
        <p style={{ textAlign: "center", marginTop: "30px" }}>
          Remember your password? <Link to="/" style={{ color: "#416d3e" }}>Log In</Link>
        </p>
      </form>
    </div>
  );
}
