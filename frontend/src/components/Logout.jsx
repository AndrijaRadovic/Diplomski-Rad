// import React, { useState } from "react";
// import '../styles/Login.css';
// import {apiService} from './ApiService.js';
// import { Korisnik } from "../model/Korisnik.ts";
// import CryptoJS from 'crypto-js'
// import { useNavigate } from "react-router-dom";

// const Login = () => {

//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();

//     const hashPassword = (password) => {
//         return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
//     };

//     const handleLogin = async (e) =>{
//         e.preventDefault();

//         const user = new Korisnik();
//         user.username = username;
//         user.password = hashPassword(password);

//         try{
//             await apiService.login(user);
//             console.log('provera');
//             //proveri ovo
//             navigate('/');
//         } catch(ex){
//             console.log('greska')
//         }
//     };

//     return (
//             <div className="box">
//                 <div className="content">
//                     <h1>Kolor Tim</h1>
//                     <form className="forma" onSubmit={handleLogin}>
//                         <input
//                             type="text"
//                             name="username"
//                             onChange={(e) => setUsername(e.target.value)}
//                             placeholder="Username"
//                             required   
//                         />
//                         <input
//                             type="password"
//                             name="password"
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder="Password"
//                             required   
//                         />
//                         <button type="submit">Log in</button>
//                     </form>
//                 </div>
//             </div>
//     );
// };

// export default Login;

import React, { useEffect, useState } from "react";
import '../styles/Login.css';
import {apiService} from './ApiService.js';
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    const [hasToken, setHasToken] = useState(false);

    useEffect(()=>{
        const token = window.sessionStorage.getItem('token');
        if (token) {
            setHasToken(true);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(()=>{
        if (hasToken) {
            apiService.deleteLoginInfo();
            const timer = setTimeout(() => {
                navigate('/login');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [navigate, hasToken]);


    return (
        <div className="login-container">
            <div className="box">
                <div className="content">
                    <h1>Uspešno ste se odjavili</h1>
                </div>
            </div>
        </div>
    );
};

export default Logout;
