import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import '../styles/ProductsTable.css';
import { Toaster, toast } from "react-hot-toast";
import { apiService } from './ApiService.js';
import { useNavigate } from 'react-router-dom';
import { TipProizvoda } from '../model/TipProizvoda.ts';

const ProductsTable = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedTipProizvoda, setSelectedTipProizvoda] = useState('');
    const navigate = useNavigate();

    // Fetch all products on mount
    const fetchProducts = async () => {
        try {
            const response = await apiService.getAllProducts();
            setProducts(response);
            console.log(response);
        } catch (error) {
            toast.error("Greška prilikom učitavanja proizvoda");
            console.error(error);
        }
    };
    useEffect(() => {

        fetchProducts();
    }, []);

    // Function to handle search
    const handleSearch = async () => {
        try {
            if(!searchTerm){
                fetchProducts();
                return;
            }
            const response = await apiService.findProducts(searchTerm);
            setProducts(response);
        } catch (error) {
        }
    };

    // Function to handle row selection
    const handleRowClick = (product) => {
        setSelectedProduct(product);
    };

    // Function to handle delete confirmation
    const handleDelete = async () => {
        if (selectedProduct) {
            try {
                await apiService.deleteProduct(selectedProduct);
                toast.success("Proizvod uspešno obrisan");
                fetchProducts();
                setShowDeleteDialog(false);
                setSelectedProduct(null);
            } catch (error) {
                toast.error("Greška prilikom brisanja proizvoda");
                console.error(error);
            }
        }
    };

    return (
        <>
            <div className="products-table-page-container">
                <Navbar />
                <Toaster />
                <div className="products-table-components-container">
                    <h1 className="products-table-title">Proizvodi</h1>
                    <div className="products-table-search-container">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Pretraži proizvode po nazivu"
                            className="products-table-search-input"
                        />
                        <button onClick={handleSearch} className="products-table-search-button">
                            Pretraži
                        </button>

                        {/*<select
                            value={selectedTipProizvoda}
                            onChange={handleTipProizvodaChange}
                            className="products-table-filter-select"
                        >
                            <option value="">Izaberite tip proizvoda</option>
                            <option value={TipProizvoda.Alat}>Alat</option>
                            <option value={TipProizvoda.Farba}>Farba</option>
                            <option value={TipProizvoda.Plocice}>Pločice</option>
                        </select>*/}
                    </div>

                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Naziv proizvoda</th>
                                <th>Cena</th>
                                <th>Tip proizvoda</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr
                                    key={product.sifraProizvoda}
                                    className={selectedProduct?.sifraProizvoda === product.sifraProizvoda ? 'selected' : ''}
                                    onClick={() => handleRowClick(product)}
                                >
                                    <td>{product.nazivProizvoda}</td>
                                    <td>{product.cena}</td>
                                    <td>{TipProizvoda[product.tipProizvoda]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="products-table-buttons">
                        <button onClick={() => navigate('/')} className="products-table-button">
                            Nazad
                        </button>
                        
                        {window.sessionStorage.getItem('role') == 0 && 
                            <button
                                onClick={() => selectedProduct && navigate(`/products/${selectedProduct.sifraProizvoda}`)}
                                className="products-table-button"
                                disabled={!selectedProduct}
                            >
                                Izmeni
                            </button>
                        }               
                        
                        {window.sessionStorage.getItem('role') == 0 && 
                            <button
                                onClick={() => setShowDeleteDialog(true)}
                                className="products-table-button products-table-button-danger"
                                disabled={!selectedProduct}
                            >
                                Obriši
                            </button>
                        }
                    </div>

                    {showDeleteDialog && (
                        <div className="products-table-dialog">
                            <div className="products-table-dialog-content">
                                <h3>Da li ste sigurni da želite da obrišete izabrani proizvod?</h3>
                                <div className="products-table-dialog-buttons">
                                    <button onClick={() => setShowDeleteDialog(false)} className="products-table-button">
                                        Ne
                                    </button>
                                    <button onClick={handleDelete} className="products-table-button products-table-button-danger">
                                        Da
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductsTable;
