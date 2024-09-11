import React, { useState, useEffect } from 'react';
import { apiService } from './ApiService';
import '../styles/ReceiptsSearch.css';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './Navbar';
import { StatusRacuna } from '../model/StatusRacuna.ts';

const ReceiptsSearch = () => {
    const [receipts, setReceipts] = useState([]);
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllReceipts();
    }, []);

    const fetchAllReceipts = async () => {
        try {
            const response = await apiService.getAllReceipts();
            setReceipts(response.slice(0, 10));  // Prikazujemo prvih 10 računa
            setFilteredReceipts(response.slice(0, 10));
        } catch (error) {
            console.error("Error fetching receipts", error);
        }
    };

    const handleDateChange = async (date) => {
        setSelectedDate(date);
        if (date === '') {
            setFilteredReceipts(receipts);
        } else {
            try {
                const response = await apiService.getReceiptsByDate(date);
                setFilteredReceipts(response);
            } catch (error) {
                console.error(error);
                toast.error("Nema računa kreiranih tog dana");
            }
        }
    };

    const handleReceiptSelect = (e) => {
        const receipt = filteredReceipts.find(r => r.sifraRacuna === Number(e.target.value));
        setSelectedReceipt(receipt);
    };

    const handleEdit = () => {

        if(selectedReceipt.statusRacuna != StatusRacuna.Aktivan){
            toast.error("Moguće je izmeniti samo aktivne račune");
            return;
        }

        navigate(`/receipts/${selectedReceipt.sifraRacuna}`);
    };

    const handleCancel = async () => {

        setShowDialog(false);

        if(selectedReceipt.statusRacuna == StatusRacuna.Storniran ||
            selectedReceipt.statusRacuna == StatusRacuna.Storno
        ){
            toast.error("Nije moguće stornirati stornirane i storno račune");
            return;
        }

        selectedReceipt.ukupnaCenaRacuna = -selectedReceipt.ukupnaCenaRacuna;
        selectedReceipt.stavkeRacuna.forEach(stavka => {
            stavka.kolicina = -stavka.kolicina;
            stavka.ukupnaCenaStavke = -stavka.ukupnaCenaStavke;
        });
        selectedReceipt.korisnik.sifraKorisnika = window.sessionStorage.getItem('userId');
        selectedReceipt.korisnik.token = '';
        selectedReceipt.korisnik.password = '';
        selectedReceipt.statusRacuna = StatusRacuna.Storno;

        console.log("storniran: ", selectedReceipt);

        if (selectedReceipt) {
            try {
                await apiService.cancelReceipt(selectedReceipt);
                toast.success("Račun uspešno storniran!");
                setSelectedReceipt(null);
                fetchAllReceipts(); // Ponovno preuzimanje računa nakon storniranja
            } catch (error) {
                console.error("Error cancelling receipt", error);
                toast.error("Greška prilikom storniranja računa.");
            }
        }
    };

    return (
        <>
            {/* <div className='container'> */}
            <Navbar />
            <div className="receipt-search-container">
                <Toaster />
                <div className="receipt-search">
                    <h1>Odabir Računa</h1>
                    <div className="receipt-search-inputs">
                        {/* Combobox za odabir računa */}
                        <select
                            value={selectedReceipt?.sifraRacuna || ""}
                            onChange={handleReceiptSelect}
                        >
                            <option value="">Izaberite račun</option>
                            {filteredReceipts.map(receipt => (
                                <option key={receipt.sifraRacuna} value={receipt.sifraRacuna}>
                                    {receipt.korisnik.ime} {receipt.korisnik.prezime} - {new Date(receipt.datumVreme).toLocaleString()} - {StatusRacuna[receipt.statusRacuna]}
                                </option>
                            ))}
                        </select>

                        {/* Polje za unos datuma */}
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                        />
                    </div>

                    <div className="receipt-search-summary">
                        <h2>Detalji Računa</h2>
                        {selectedReceipt && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Proizvod</th>
                                        <th>Količina</th>
                                        <th>Ukupna Cena Stavke</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedReceipt.stavkeRacuna.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.proizvod.nazivProizvoda}</td>
                                            <td>{item.kolicina}</td>
                                            <td>{item.ukupnaCenaStavke} RSD</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {selectedReceipt && (
                            <h3>Ukupna Cena: {selectedReceipt.ukupnaCenaRacuna} RSD</h3>
                        )}
                    </div>

                    <div className="receipt-search-buttons">
                        <button onClick={() => navigate(-1)}>Nazad</button>
                        {window.sessionStorage.getItem('role') == 0 && 
                        <button onClick={handleEdit} disabled={!selectedReceipt}>Izmeni Račun</button>}
                        {window.sessionStorage.getItem('role') == 0 && 
                        <button onClick={() => setShowDialog(true)} disabled={!selectedReceipt}>Storniraj Račun</button>}
                    </div>
                </div>
                {showDialog && (
                    <div className="receipt-dialog">
                        <div className="receipt-dialog-content">
                            <h3>Da li ste sigurni da želite da stornirate izabrani račun?</h3>
                            <div className="receipt-dialog-buttons">
                                <button className="user-form-button" onClick={() => setShowDialog(false)}>
                                    Odustani
                                </button>
                                <button className="user-form-button user-form-button-danger" onClick={handleCancel}>
                                    Da
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        {/* </div> */}
    </>
    );
};

export default ReceiptsSearch;
