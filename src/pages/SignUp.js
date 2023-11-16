import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import {createUserWithEmailAndPassword} from "firebase/auth";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential)
                navigate("/"); // navigate to log in if sign up is successful
            }).catch((error) => {
                console.log(error)
            })
    }
    
    return (
        <div className="sign-up-container">
            <form onSubmit={signUp}>
                <h1>Create An Account</h1>
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
                placeholder="Create your password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}>
                </input>
                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account? <Link to="/">Sign In</Link>
            </p>
        </div>
    );
}