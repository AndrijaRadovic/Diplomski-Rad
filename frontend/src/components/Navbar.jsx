import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/img/Kolor-Tim-Logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const role = window.sessionStorage.getItem('role');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to={"/"}> <img src={logo} alt="Logo" /> </Link>
      </div>
      <div className={`menu ${isOpen ? 'open' : ''}`}>
        
        <div className="dropdown">
          <button className="dropbtn">Proizvod</button>
          <div className="dropdown-content">
            {role === '0' && <Link to="/product">Kreiraj proizvod</Link>}
            <Link to="/products">Prikaži proizvode</Link>
          </div>
        </div>
        <div className="dropdown">
          <button className="dropbtn">Račun</button>
          <div className="dropdown-content">
            <Link to="/receipt">Kreiraj račune</Link>
            <Link to="/receipts">Prikaži račune</Link>
          </div>
        </div>
        <div className="dropdown">
          <button className="dropbtn">Korisnik</button>
          <div className="dropdown-content">
            {role === '0' && <Link to="/user">Kreiraj prodavca</Link>}
            {role === '0' && <Link to="/users">Prikaži prodavce</Link>}
            <Link to="/change-password">Promeni šifru</Link>
            <Link to="/logout">Odjavi se</Link>
          </div>
        </div>
      </div>
      <div className="burger" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </nav>
  );
};

export default Navbar;