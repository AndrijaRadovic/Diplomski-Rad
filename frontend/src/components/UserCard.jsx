import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserCard.css';
import placeholderImage from '../assets/img/User-image.jpg'; // Slika čikice
import { Uloga } from '../model/Uloga.ts';

const UserCard = ({ user }) => {

    const navigate = useNavigate();

    return (
            <div className="user-card" onClick={() => {navigate(`/users/${user.sifraKorisnika}`)}}>
                <img src={placeholderImage} alt="User avatar" className="user-card-image" />
                <div className="user-card-info">
                    <h3 className="user-card-name">{user.ime} {user.prezime}</h3>
                    <p className="user-card-role">{Uloga[user.uloga]}</p>
                    {/* <p className="user-card-email">{user.email}</p>
                    <p className="user-card-phone">{user.brojTelefona}</p> */}
                </div>
            </div>
    );
};

export default UserCard;
