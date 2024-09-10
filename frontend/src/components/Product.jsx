import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Product.css';
import Navbar from './Navbar.jsx';
import ProductForm from './ProductForm.tsx';
import { apiService } from './ApiService.js';
import Loading from './Loading.jsx';

const Product = () => {

    const navigate = useNavigate();
    const {id} = useParams();
    const [product, setProduct] = useState({});

    useEffect(()=>{
        if (!window.sessionStorage.getItem('token')){
            navigate('/login');
            return;
        }

        if(id){
            const fetchProduct = async () => {
                try{
                    setProduct(null);
                    const response = await apiService.getProduct(id);
                    setProduct(response);
                    // setTimeout(()=>{setProduct(response);}, 2000);
                    
                } catch(error){
                        console.error('Error fetching product: ', error);
                }
            }
            fetchProduct();
        } else {
            setProduct(null);
        }

        console.log("proizvod ", product);
        
    }, [navigate, id]);

    return(
        <>
            {((product && id) || (!product && !id)) ? (

                <div className="container">
                    <Navbar />
                    <ProductForm product={product}/>
                </div>

            ):(
                <div className="container">
                    <Navbar />
                    <Loading />
                </div>
            )}
        </>
    );
};

export default Product;