import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const logIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate("/home"); // navigate to home if log in successful
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="login-container" style={{ backgroundColor: "#9cc599", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <form onSubmit={logIn} style={{ width: "400px", margin: "auto", padding: "55px", borderRadius: "10px", background: "#fff" }}>
        <h1 style={{ textAlign: "center", fontSize: "44px", fontWeight: "bold", marginTop: "40px", marginBottom: "40px" }}>
          WaterCrop
        </h1>
        <h2 style={{ marginBottom: "25px", fontSize: "30px" }}>Login</h2>
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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <p style={{ textAlign: "center", marginTop: "10px", marginBottom: "30px" }}>
          <Link to="/forgot-password" style={{ color: "#416d3e" }}>Forgot Password?</Link>
        </p>
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#4d814a", color: "#fff", border: "none", borderRadius: "5px" }}>
          Log In
        </button>
        <p style={{ textAlign: "center", marginTop: "25px" }}>
            Don't have an account? <Link to="/sign-up" style={{ color: "#416d3e" }}>Sign Up</Link>
        </p> 
      </form>
    </div>
  );
}

/*
import React, {useState} from "react";
import { useNavigate , Link} from "react-router-dom";
import { auth } from "../firebase/firebase";
import {signInWithEmailAndPassword} from "firebase/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const logIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential)
                navigate("/home"); // navigate to home if log in successful
            }).catch((error) => {
                console.log(error)
            })
    }

    return (
        <div className="login-container">
            <form onSubmit={logIn}>
                <h1 style={{fontSize: '60px', fontWeight: 'bold', marginTop: '100px', marginBottom: '60px'}}>Welcome to WaterCrop!</h1>
                <h1></h1>
                <h1 style={{marginBottom: '30px'}}>Login</h1>
                <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}>
                </input>
                <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
                </input>
                <button type="submit">Log In</button>
            </form>
            <p>
                Don't have an account? <Link to="/sign-up">Sign Up</Link>
            </p>
        </div>
    );
}
*/