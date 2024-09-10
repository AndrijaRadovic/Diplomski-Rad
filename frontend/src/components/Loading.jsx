import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import Navbar from './Navbar.jsx';

const Loading = () => {

    return(
        <>
                <div className="loading-container">
                    <div className="box">
                        <div className="content">
                            <h1>Loading...</h1>
                        </div>
                    </div>
                 </div>
        </>
    );
};

export default Loading;