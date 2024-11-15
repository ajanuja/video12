import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import './style1.css';
import { auth } from './firebase';  
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);  
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully");
      setError(null);  
      navigate('/navbar');  
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Failed to log in. Please check your email and password.");
    }
  };

  return (
    <div style={{ marginLeft: '1vw' }} className='login template d-flex justify-content-center align-items-center vh-100'>
      <div className='form-container p-5 rounded bg-white'>
        <form onSubmit={handleSubmit}>
          <h3 className='text-center'>Login</h3>
          
          {error && <p className="text-danger text-center">{error}</p>}

          <div className='mb-2'>
            <label htmlFor='email'>Email</label> 
            <input 
              type="email" 
              placeholder='Enter Email' 
              className='form-control' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className='mb-2'>
            <label htmlFor='password'>Password</label> 
            <input 
              type="password" 
              placeholder='Enter password' 
              className='form-control' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className='mb-2'>
            <input type="checkbox" className='custom-control custom-checkbox' id="check"/>
            <label htmlFor="check" className='custom-input-label ms-2'>Remember me</label>
          </div>
          <Link to='/Sidebar'>
          <div className='d-grid'>
            <button style={{ backgroundColor: 'rgb(65, 65, 122)', color: 'white' }} className='btn btn-primary' type="submit">
              Login 
            </button>  
          </div>
          </Link>

          <p className='text-end mt-2'>
            Forgot <a href="#">Password?</a> | <Link to="/signup" className='ms-2'>Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
