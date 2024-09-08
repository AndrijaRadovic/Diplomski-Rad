import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/User.css';
import Navbar from './Navbar.jsx';
import UserForm from './UserForm.tsx';

const User = () => {

    const navigate = useNavigate();

    useEffect(()=>{
        
    }, [navigate]);

    return(
        <>
            <div className="container">
                <Navbar />
                <UserForm />
            </div>
        </>
    );
};

export default User;