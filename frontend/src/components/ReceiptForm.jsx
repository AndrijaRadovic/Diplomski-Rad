import React, { useState, useEffect } from 'react';
import { apiService } from './ApiService';
import '../styles/ReceiptForm.css';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'
import { Racun } from '../model/Racun.ts'
import { Korisnik } from "../model/Korisnik.ts";
import { StavkaRacuna } from "../model/StavkaRacuna.ts";
import { StatusRacuna } from "../model/StatusRacuna.ts";
import { Proizvod } from "../model/Proizvod.ts";
import { Toaster, toast } from 'react-hot-toast';

const ReceiptForm = ({receipt}) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllProducts();

        if (receipt && receipt.stavkeRacuna) {
            setItems(receipt.stavkeRacuna.map(stavka => ({
                product: stavka.proizvod,
                quantity: stavka.kolicina,
                totalPrice: stavka.ukupnaCenaStavke
            })));
            setTotalPrice(receipt.ukupnaCenaRacuna);
        }

    }, [receipt]);

    const fetchAllProducts = async () => {
        try {
            const response = await apiService.getAllProducts();
            setProducts(response);
            setFilteredProducts(response);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    const handleSearch = async (term) => {
        setSearchTerm(term);
        if (term === '') {
            setFilteredProducts(products);
        } else {
            try{
                const response = await apiService.findProducts(term);
                setFilteredProducts(response);
            }catch(error){
                console.log(error);
            }
        }
    };

    const handleAddItem = () => {
        if (!selectedProduct || quantity <= 0) return;

        const existingItem = items.find(item => item.product.sifraProizvoda === selectedProduct.sifraProizvoda);
        let updatedItems = [...items];
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.totalPrice = existingItem.quantity * existingItem.product.cena;
        } else {
            updatedItems.push({
                product: selectedProduct,
                quantity,
                totalPrice: quantity * selectedProduct.cena
            });
        }

        setItems(updatedItems);
        setQuantity(1);
        setSearchTerm('');
        updateTotalPrice(updatedItems);
    };

    const updateTotalPrice = (updatedItems) => {
        const newTotalPrice = updatedItems.reduce((acc, item) => acc + item.totalPrice, 0);
        setTotalPrice(newTotalPrice);
    };

    const handleDeleteItem = () => {
        if (selectedItem !== null) {
            const updatedItems = items.filter((item, index) => index !== selectedItem);
            setItems(updatedItems);
            updateTotalPrice(updatedItems);
            setSelectedItem(null);
        }
    };

    const handleSaveReceipt = async () => {

        if(items.length == 0){
            toast.error("Nije moguće kreirati račun bez stavki");
            return;
        }

        const receipt = {
            sifraRacuna: 0,
            datumVreme: new Date(),
            ukupnaCenaRacuna: totalPrice,
            korisnik: { 
                sifraKorisnika: window.sessionStorage.getItem('userId'),
                ime: '',
                prezime: '',
                pol: 0,
                uloga: 1,
                username: "",
                password: "",
                jmbg: "",
                email: "",
                brojTelefona: "",
                token: ""
             }, 
            stavkeRacuna: items.map((item, index) => ({
                redniBroj: index + 1,
                kolicina: item.quantity,
                ukupnaCenaStavke: item.totalPrice,
                proizvod: item.product
            })),
            statusRacuna: StatusRacuna.Aktivan
        };

        console.log("racun: ", receipt.datumVreme);


        try {
            await apiService.createReceipt(receipt);
            toast.success("Račun je uspešno kreiran!");
            setItems([]);
            setTotalPrice(0);
            setSelectedProduct(null);
            setQuantity(1);
            setSearchTerm('');
            // navigate('/');
        } catch (error) {
            toast.error("Došlo je do greške pri kreiranju računa", error);
        }
    };

    const handleUpdateReceipt = async () => {

        if(items.length == 0){
            toast.error("Nije moguće kreirati račun bez stavki");
            return;
        }

        const updatedReceipt = {
            sifraRacuna: receipt.sifraRacuna,
            datumVreme: new Date(),
            ukupnaCenaRacuna: totalPrice,
            korisnik: { 
                sifraKorisnika: window.sessionStorage.getItem('userId'),
                ime: '',
                prezime: '',
                pol: 0,
                uloga: 1,
                username: "",
                password: "",
                jmbg: "",
                email: "",
                brojTelefona: "",
                token: ""
             }, 
            stavkeRacuna: items.map((item, index) => ({
                redniBroj: index + 1,
                kolicina: item.quantity,
                ukupnaCenaStavke: item.totalPrice,
                proizvod: item.product
            })),
            statusRacuna: StatusRacuna.Izmenjen
        };

        console.log("izmenjen: ", updatedReceipt);

        try {
            await apiService.updateReceipt(updatedReceipt);
            toast.success("Račun je uspešno izmenjen");
            setTimeout(() => navigate(-1), 1500);
        } catch (error) {
            toast.error("Došlo je do greške pri izmeni računa", error);
        }
        
    };

    return (
        <div className="receipt-form-container">
            <Toaster />
            <div className="receipt-form">
                <h1>{receipt ? "Izmena Računa" : "Kreiranje Računa"}</h1>
                <div className="receipt-form-inputs">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Pretraži proizvod..."
                    />

                    <select
                        value={selectedProduct?.sifraProizvoda || ""}
                        onChange={(e) => {
                            const product = filteredProducts.find(p => p.sifraProizvoda === Number(e.target.value));
                            setSelectedProduct(product);
                        }}
                    >
                        <option value="">Izaberi Proizvod</option>
                        {filteredProducts.map(product => (
                            <option key={product.sifraProizvoda} value={product.sifraProizvoda}>
                                {product.nazivProizvoda}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={selectedProduct?.cena || ''}
                        readOnly
                        placeholder="Cena"
                        disabled
                    />
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        min="1"
                        placeholder="Količina"
                    />
                    <button onClick={handleAddItem}>Dodaj Stavku</button>
                </div>

                <div className="receipt-form-summary">
                    <h2>Stavke Računa</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Redni Broj</th>
                                <th>Proizvod</th>
                                <th>Količina</th>
                                <th>Ukupna Cena Stavke</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr
                                    key={index}
                                    onClick={() => setSelectedItem(index)}
                                    className={selectedItem === index ? 'selected' : ''}
                                >
                                    <td>{index + 1}</td>
                                    <td>{item.product.nazivProizvoda}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.totalPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3>Ukupna Cena: {totalPrice} RSD</h3>
                </div>

                <div className="receipt-form-buttons">
                    <button onClick={() => navigate(-1)}>Nazad</button>
                    <button onClick={handleDeleteItem} disabled={selectedItem === null}>Obriši Stavku</button>
                    <button onClick={receipt ? handleUpdateReceipt : handleSaveReceipt}>{receipt ? "Izmeni Račun" : "Kreiraj Račun"}</button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptForm;
