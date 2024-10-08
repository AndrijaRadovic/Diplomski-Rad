import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/UserForm.css';
import { Pol } from '../model/Pol.ts';
import { Korisnik } from '../model/Korisnik.ts';
import { Uloga } from '../model/Uloga.ts';
import CryptoJS from 'crypto-js';
import { apiService } from './ApiService.js';
import { Toaster, toast } from 'react-hot-toast';

const UserForm = ( { user } ) => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        ime: '',
        prezime: '',
        pol: '',
        username: '',
        password: '',
        jmbg: '',
        telefon: '',
        email: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        console.log("user: ", user);

        if(user){
            setFormValues({
                ime: user.ime,
                prezime: user.prezime,
                username: user.username,
                password: '',
                email: user.email,
                jmbg: user.jmbg,
                pol: user.pol,
                telefon: user.brojTelefona
            })

            console.log("formValues: ", formValues);
        } else {
            setFormValues({
                ime: '',
                prezime: '',
                username: '',
                password: '',
                email: '',
                jmbg: '',
                pol: '',
                telefon: ''
            })
        }

        console.log(user);

    }, [user]);

    const hashPassword = (password) => {
        return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        // Validacija imena
        if (!formValues.ime.match(/[A-Za-zČĆŠĐŽčćšđžА-Яа-я]{2,}$/)) {
            newErrors.ime = "Ime mora sadržati samo slova i imati bar 2 karaktera.";
        }

        // Validacija prezimena
        if (!formValues.prezime.match(/[A-Za-zČĆŠĐŽčćšđžА-Яа-я]{2,}$/)) {
            newErrors.prezime = "Prezime mora sadržati samo slova i imati bar 2 karaktera.";
        }

        // Validacija username-a
        if (!formValues.username.match(/^[A-Za-z0-9]{2,}$/)) {
            newErrors.username = "Username mora sadržati bar 2 karaktera i sme sadržati samo slova i brojeve.";
        }

        // Validacija password-a
        if (formValues.password.length < 8 && !user) {
            newErrors.password = "Password mora imati najmanje 8 karaktera.";
        }

        // Validacija JMBG-a
        if (!formValues.jmbg.match(/^\d{13}$/)) {
            newErrors.jmbg = "JMBG mora sadržati tačno 13 cifara.";
        }

        // Validacija broja telefona
        if (!formValues.telefon.match(/^\+381\d{7,}$/)) {
            newErrors.telefon = "Broj telefona mora biti u formatu +381 i sadržati 8-9 cifara.";
        }

        // Validacija email-a
        if (formValues.email && !formValues.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = "Email format nije validan.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const korisnik = new Korisnik();
            korisnik.sifraKorisnika = user?.sifraKorisnika;
            korisnik.brojTelefona = formValues.telefon;
            korisnik.email = formValues.email;
            korisnik.ime = formValues.ime;
            korisnik.jmbg = formValues.jmbg;
            korisnik.password = hashPassword(formValues.password);
            korisnik.pol = parseInt(formValues.pol);
            korisnik.prezime = formValues.prezime;
            korisnik.uloga = Uloga.Prodavac;
            korisnik.username = formValues.username;
            console.log("korisnik: ", korisnik);
            
            try {
                if(user){
                    const response = await apiService.updateUser(korisnik);
                    toast.success('Prodavac je uspešno izmenjen!');
                } else{
                    const response = await apiService.createUser(korisnik);
                    toast.success('Prodavac je uspešno kreiran!');
                }
                setTimeout(()=>{navigate('/')}, 1500);
            } catch (error) {
                toast.error(`Došlo je do greške prilikom kreiranja prodavca: ${error.response.data}`);
            }
        }
    };

    const deleteUser = async () => {
        try {

            if(user.uloga == 0){
                toast.error('Nije moguće obrisati administratora');
                return;
            }

            await apiService.deleteUser(user.sifraKorisnika); // Brisanje korisnika
            toast.success('Korisnik je uspešno obrisan!');
            setTimeout(() => navigate('/'), 1500);

        } catch (error) {
            toast.error(`Došlo je do greške prilikom brisanja korisnika: ${error.response.data}`);
        }
    };

    return (
        <div className="user-form-container">
            <Toaster />
            <h2 className="user-form-title">{user ? "Izmena Prodavca" : "Kreiranje Prodavca"}</h2>
            <form onSubmit={handleSubmit} className="user-form">
                <div className="user-form-field">
                    <label className="user-form-label">Ime</label>
                    <input 
                        type="text" 
                        name="ime" 
                        value={formValues.ime} 
                        onChange={handleChange} 
                        className="user-form-input"
                        required 
                    />
                    {errors.ime && <span className="error">{errors.ime}</span>}
                </div>

                <div className="user-form-field">
                    <label className="user-form-label">Prezime</label>
                    <input 
                        type="text" 
                        name="prezime" 
                        value={formValues.prezime} 
                        onChange={handleChange} 
                        className="user-form-input"
                        required 
                    />
                    {errors.prezime && <span className="error">{errors.prezime}</span>}
                </div>

                <div className="user-form-field">
                    <label className="user-form-label">Pol</label>
                    <select name="pol" value={formValues.pol} onChange={handleChange} className="user-form-input" required disabled={!!user} >
                        <option value="">Izaberite pol</option>
                        <option value={Pol.Muski}>Muški</option>
                        <option value={Pol.Zenski}>Ženski</option>
                    </select>
                </div>

                <div className="user-form-field">
                    <label className="user-form-label">Username</label>
                    <input 
                        type="text" 
                        name="username" 
                        value={formValues.username} 
                        onChange={handleChange} 
                        className="user-form-input"
                        required 
                    />
                    {errors.username && <span className="error">{errors.username}</span>}
                </div>

                {!user && (
                    < div className="user-form-field">
                        <label className="user-form-label">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formValues.password} 
                            onChange={handleChange} 
                            className="user-form-input"
                            required 
                        />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                )}

                <div className="user-form-field">
                    <label className="user-form-label">JMBG</label>
                    <input 
                        type="text" 
                        name="jmbg" 
                        value={formValues.jmbg} 
                        onChange={handleChange}
                        maxLength={13}
                        className="user-form-input"
                        required
                        disabled = {!!user}
                    />
                    {errors.jmbg && <span className="error">{errors.jmbg}</span>}
                </div>

                <div className="user-form-field">
                    <label className="user-form-label">Broj telefona</label>
                    <input 
                        type="text" 
                        name="telefon" 
                        value={formValues.telefon} 
                        onChange={handleChange} 
                        className="user-form-input"
                        required
                    />
                    {errors.telefon && <span className="error">{errors.telefon}</span>}
                </div>

                <div className="user-form-field">
                    <label className="user-form-label">Email (opcionalno)</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formValues.email} 
                        onChange={handleChange} 
                        className="user-form-input"
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="user-form-button-container">
                    <button type="button" className="user-form-button user-form-button-secondary" onClick={() => navigate('/')}>
                        Nazad
                    </button>
                    {user && (
                        <button type='button' className = "user-form-button" onClick={() => {setShowDialog(true)}}>Obriši</button>
                    )}
                    <button type="submit" className="user-form-button">Sačuvaj</button>
                </div>
            </form>

            {showDialog && (
                <div className="dialog">
                    <div className="dialog-content">
                        <h3>Da li ste sigurni da želite da obrišete ovog korisnika?</h3>
                        <div className="dialog-buttons">
                            <button className="user-form-button" onClick={() => setShowDialog(false)}>
                                Odustani
                            </button>
                            <button className="user-form-button user-form-button-danger" onClick={deleteUser}>
                                Da
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserForm;