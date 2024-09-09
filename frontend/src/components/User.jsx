import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/User.css';
import Navbar from './Navbar.jsx';
import { apiService } from './ApiService.js';
import UserForm from './UserForm.tsx'

const User = ( ) => {

    const navigate = useNavigate();
    const {id} = useParams();
    const [user, setUser] = useState({});

    useEffect(() => {

        if (!window.sessionStorage.getItem('token')){
            navigate('/login');
            return;
        }

        if(id){
        const fetchUser = async () => {
                try{
                    const response = await apiService.getUser(id);
                    setUser(response);
                    // console.log("korisnik ", user);
                } catch(error){
                    console.error('Error fetching user: ', error);
                }
            }
            fetchUser();
        } else {
            setUser(null);
        }


    }, [navigate, id]);

    return(
        <>
            <div className="container">
                <Navbar />
                <UserForm user={user} />
            </div>
        </>
    );
};

export default User;