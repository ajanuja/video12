import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import './style1.css';
import { auth } from './firebase'; 
import { createUserWithEmailAndPassword } from "firebase/auth";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Account Created");

      
      navigate('/home');  
    } catch (err) {
      console.error("Error creating account:", err);
    }
  };

  return (
    <div className="signup template d-flex justify-content-center align-items-center vh-100">
      <div style={{ padding: '20px', borderRadius: '10px',marginLeft:'28vw' }}>
        <div className="form-container p-5 rounded">
          <form onSubmit={handleSubmit}>
            <h3 className="text-center">Sign Up</h3>

            <div className="mb-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-grid mt-2">
              <button
                style={{ backgroundColor: 'rgb(65, 65, 122)', color: 'white' }}
                className="btn btn-primary"
                type="submit"
              >
                Sign Up
              </button>
            </div>

            <p className="text-end mt-2">
              Already Registered? <Link to="/login" className="ms-2">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;   