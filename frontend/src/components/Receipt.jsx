import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import '../styles/ProductsTable.css';
import { apiService } from './ApiService.js';
import { useNavigate, useParams } from 'react-router-dom';
import ReceiptForm from '../components/ReceiptForm'

const Receipt = () => {

    const navigate = useNavigate();
    const {id} = useParams();
    const [receipt, setReceipt] = useState({});

    useEffect(() => {

        if(id){
        const fetchReceipt = async () => {
                try{
                    const response = await apiService.getReceipt(id);
                    setReceipt(response);
                    console.log("racun ", receipt);
                } catch(error){
                    console.error('Error fetching receipt: ', error);
                }
            }
            fetchReceipt();
        } else {
            setReceipt(null);
        }


    }, [navigate, id]);

    return (
        <>
        <div className="container">
            <Navbar />
            <ReceiptForm receipt={receipt} />
        </div>
        </>
    );
};

export default Receipt;
