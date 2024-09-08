import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Product.css';
import Navbar from './Navbar.jsx';
import ProductForm from './ProductForm.tsx';

const Product = () => {

    const navigate = useNavigate();

    useEffect(()=>{
        
    }, [navigate]);

    return(
        <>
            <div className="container">
                <Navbar />
                <ProductForm />
            </div>
        </>
    );
};

export default Product;