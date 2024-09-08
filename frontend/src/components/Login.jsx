import React, { useState, useEffect } from "react";
import '../styles/Login.css';
import {apiService} from './ApiService.js';
import { Korisnik } from "../model/Korisnik.ts";
import CryptoJS from 'crypto-js';
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        if(window.sessionStorage.getItem('token')){
            navigate('/');
        }
    });

    const hashPassword = (password) => {
        return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    };

    const handleLogin = async (e) =>{
        e.preventDefault();

        const user = new Korisnik();
        user.username = username;
        user.password = hashPassword(password);

        try{
            await apiService.login(user);
            navigate('/');
        } catch(ex){
            toast.error('Neuspešna prijava');
            console.log('greska')
        }
    };

    return (
        <div className="login-container">
            <Toaster />
            <div className="login-box">
                <div className="login-content">
                    <h1>Kolor Tim</h1>
                    <form className="login-forma" onSubmit={handleLogin}>
                        <input
                            type="text"
                            name="username"
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required   
                        />
                        <input
                            type="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required   
                        />
                        <button type="submit">Log in</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
