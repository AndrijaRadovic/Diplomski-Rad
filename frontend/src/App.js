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
import UserCard from './components/UserCard.jsx';
import UserSearch from './components/UserSearch.jsx';
import ProductsTable from './components/ProductsTable.jsx';
import Receipt from './components/Receipt';
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
        {/* <Route path='/user/id' element={<UserCard user={{ime: 'Pera', prezime: 'Peric', uloga: 'Admin', email: 'pera@gmail.com', brojTelefona: '+38161665684'}} />} /> */}
        <Route path='/users' element={<UserSearch />} />
        <Route path='/users/:id' element={<User />} />
        <Route path='/products/:id' element={<Product />} />
        <Route path='/products' element={<ProductsTable />} />
        <Route path='/create-receipt' element={<Receipt />} />
        <Route path='/receipts/:id' element={<Receipt />} />
      </Routes>
    </Router>
  );
}

export default App;
