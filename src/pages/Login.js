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
                <h1 style={{fontSize: '50px', fontWeight: 'bold', marginBottom: '30px'}}>Welcome to WaterCrop!</h1>
                <h1></h1>
                <h1>Login</h1>
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