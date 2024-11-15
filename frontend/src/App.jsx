import React from 'react';
import Navbar from './Navbar'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 

const App = () => {
  return (
    <Router> 
      <div className="container">
        <Navbar /> 
      </div>
    </Router>
  );
};

export default App;
