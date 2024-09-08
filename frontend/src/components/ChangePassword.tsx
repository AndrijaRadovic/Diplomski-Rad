import React,{ useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster, toast } from "react-hot-toast";
import '../styles/ChangePassword.css';
import cryptoJs from "crypto-js";
import { apiService } from "./ApiService";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        oldPassword: '',
        newPassword: '',
        newPasswordRepeat: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if(!window.sessionStorage.getItem('token')){
            navigate('/login');
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const hashPassword = (password) => {
        return cryptoJs.SHA256(password).toString(cryptoJs.enc.Hex);
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if(formValues.newPassword.length < 8)
            newErrors.newPassword = "Lozinka mora imati najmanje 8 karaktera.";

        if(!(formValues.newPasswordRepeat === formValues.newPassword))
            newErrors.newPasswordRepeat = "Neispravno uneta potvrda lozinke.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(validate()){
            const request = {
                oldPassword: hashPassword(formValues.oldPassword),
                newPassword: hashPassword(formValues.newPassword)
            };

            try{
                await apiService.changePassword(request);
                toast.success("Lozinka je uspešno izmenjena!");
                setTimeout(() => navigate('/'), 1500);
            } catch (error){
                toast.error(`Došlo je do greške pri promeni lozinke: ${error.response.data}`);
            }
        }
    };

    return(
        <>
            <div className="change-password-container">
                <Navbar />
                <div className="change-password-form-container">
                    <Toaster />
                    <h2 className="change-password-form-title">Promena šifre</h2>
                    <form onSubmit={handleSubmit} className="change-password-form">
                        <div className="change-password-form-field">
                            <label className="change-password-form-label">Stara lozinka</label>
                            <input 
                                type="password" 
                                name="oldPassword" 
                                value={formValues.oldPassword} 
                                onChange={handleChange} 
                                className="change-password-form-input"
                                required 
                            />
                            {errors.oldPassword && <span className="error">{errors.oldPassword}</span>}
                        </div>

                        <div className="change-password-form-field">
                            <label className="change-password-form-label">Nova lozinka</label>
                            <input 
                                type="password" 
                                name="newPassword" 
                                value={formValues.newPassword} 
                                onChange={handleChange} 
                                className="change-password-form-input"
                                required 
                            />
                            {errors.newPassword && <span className="error">{errors.newPassword}</span>}
                        </div>

                        <div className="change-password-form-field">
                            <label className="change-password-form-label">Potvrdite novu lozinku</label>
                            <input 
                                type="password" 
                                name="newPasswordRepeat" 
                                value={formValues.newPasswordRepeat} 
                                onChange={handleChange} 
                                className="change-password-form-input"
                                required 
                            />
                            {errors.newPasswordRepeat && <span className="error">{errors.newPasswordRepeat}</span>}
                        </div>

                        <div className="change-password-form-button-container">
                        <button type="button" className="change-password-form-button change-password-form-button-secondary" onClick={() => navigate('/')}>
                            Nazad
                        </button>
                        <button type="submit" className="change-password-form-button">Izmeni</button>
                    </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ChangePassword;