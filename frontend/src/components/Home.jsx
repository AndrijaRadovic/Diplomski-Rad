import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import Navbar from './Navbar.jsx';

const Home = () => {

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(()=>{

        if(!window.sessionStorage.getItem('token')){
            navigate('/login');
        }else{
            setIsLoggedIn(true);
        }

    }, [navigate]);

    return(
        <>
            {isLoggedIn ? (
                <div className="container">
                    <Navbar />
                    <div className="pozadina"></div>
                </div>
            ):(
                <div className="loading-container">
                    <div className="box">
                        <div className="content">
                            <h1>Loading...</h1>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default Home;