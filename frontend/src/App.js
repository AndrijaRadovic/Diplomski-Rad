//import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Product from './components/Product';
import User from './components/User';
import ChangePassword from './components/ChangePassword.tsx';
// import 'normalize.css';

function App() {
  return (
    <Router className = "App">
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/product' element={<Product />} />
        <Route path='/user' element={<User />} />
        <Route path='/change-password' element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
