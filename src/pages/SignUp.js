import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate("/"); // navigate to log in if sign up is successful
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="login-container" style={{ backgroundColor: "#7cb580", border: "3px solid #7d9c7b", borderRadius: "10px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <form onSubmit={signUp} style={{ width: "400px", margin: "auto", padding: "55px", borderRadius: "10px", background: "#fff" }}>
        <h1 style={{ textAlign: "center", fontSize: "44px", fontWeight: "bold", marginTop: '40px', marginBottom: '40px' }}>
          WaterCrop
        </h1>
        <h2 style={{ marginBottom: "25px", fontSize: "30px" }}>Create an account</h2>
        <label htmlFor="email" style={{ textAlign: "left", display: "block", marginBottom: "5px", fontSize: "16px" }}>Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
        />
        <label htmlFor="password" style={{ textAlign: "left", display: "block", marginBottom: "5px", fontSize: "16px" }}>Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Create your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "35px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#4d814a", color: "#fff", border: "none", borderRadius: "5px" }}>
          Sign Up
        </button>
        <p style={{ textAlign: "center", marginTop: "25px" }}>
          Already have an account? <Link to="/" style={{ color: "#416d3e" }}>Sign In</Link>
        </p>
      </form>
    </div>
  );
}
