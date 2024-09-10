import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Proizvod } from '../model/Proizvod.ts';
import { Plocice } from '../model/Plocice.ts';
import { Farba } from '../model/Farba.ts';
import { Alat } from '../model/Alat.ts';
import { TipProizvoda } from '../model/TipProizvoda.ts';
import { TipAlata } from '../model/TipAlata.ts';
import { apiService } from '../components/ApiService';
import '../styles/ProductForm.css';
import { Toaster, toast } from 'react-hot-toast';

const ProductForm = ( { product } ) => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        nazivProizvoda: '',
        cena: '',
        tipProizvoda: '',
        tipAlata: '',
        boja: '',
        velicinaPakovanja: '',
        materijal: '',
        duzina: '',
        sirina: ''
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {

        if(product){
            if(product.tipProizvoda == TipProizvoda.Alat){
                setFormValues({
                    nazivProizvoda: product.nazivProizvoda,
                    cena: product.cena,
                    tipProizvoda: product.tipProizvoda,
                    tipAlata: product.tipAlata,
                    boja: '',
                    velicinaPakovanja: '',
                    materijal: '',
                    duzina: '',
                    sirina: ''
                });
            }
            else if (product.tipProizvoda == TipProizvoda.Plocice){
                setFormValues({
                    nazivProizvoda: product.nazivProizvoda,
                    cena: product.cena,
                    tipProizvoda: product.tipProizvoda.toString(),
                    tipAlata: '',
                    boja: '',
                    velicinaPakovanja: '',
                    materijal: product.materijal,
                    duzina: product.duzina,
                    sirina: product.sirina
                });
            }
            else if(product.tipProizvoda == TipProizvoda.Farba){
                setFormValues({
                    nazivProizvoda: product.nazivProizvoda,
                    cena: product.cena,
                    tipProizvoda: product.tipProizvoda.toString(),
                    tipAlata: '',
                    boja: product.boja,
                    velicinaPakovanja: product.velicinaPakovanja,
                    materijal: '',
                    duzina: '',
                    sirina: ''
                });
            }

            console.log("formValues: ", formValues);
        } else {
            setFormValues({
                nazivProizvoda: '',
            cena: '',
            tipProizvoda: '',
            tipAlata: '',
            boja: '',
            velicinaPakovanja: '',
            materijal: '',
            duzina: '',
            sirina: ''
            })
        }

    }, [product]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        const decimalRegex = /^[0-9]+(\.[0-9]+)?$/;
        
        if(formValues.nazivProizvoda.length == 0){
            newErrors.nazivProizvoda = "Morate uneti naziv proizvoda";
        }

        if(!decimalRegex.test(formValues.cena)){
            newErrors.cena = "Neispravno uneta cena";
        }

        if(formValues.tipProizvoda == ''){
            newErrors.tipProizvoda = "Morate izabrati tip proizvoda";
        }

        if(formValues.tipProizvoda == TipProizvoda.Plocice.toString()){

            if(formValues.materijal.length == 0){
                newErrors.materijal = "Morate uneti materijal";
            }

            if(!decimalRegex.test(formValues.duzina)){
                newErrors.duzina = "Neispravno uneta dužina";
            }

            if(!decimalRegex.test(formValues.sirina)){
                newErrors.sirina = "Neispravno uneta širina";
            }
        }

        if(formValues.tipProizvoda == TipProizvoda.Farba.toString()){

            if(formValues.boja.length == 0){
                newErrors.materijal = "Morate uneti boju";
            }

            if(!decimalRegex.test(formValues.velicinaPakovanja)){
                newErrors.velicinaPakovanja = "Neispravno uneta veličina pakovanja";
            }
        }

        if(formValues.tipProizvoda == TipProizvoda.Alat.toString()){

            if(formValues.tipAlata == ''){
                newErrors.tipAlata = "Morate izabrati tip alata";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()){

            var prod;

            if(formValues.tipProizvoda == TipProizvoda.Alat.toString()){
                prod = new Alat();
                prod.nazivProizvoda = formValues.nazivProizvoda;
                prod.cena = parseFloat(formValues.cena);
                prod.tipProizvoda = TipProizvoda.Alat;
                prod.tipAlata = parseInt(formValues.tipAlata);
            }

            if(formValues.tipProizvoda == TipProizvoda.Farba.toString()){
                prod = new Farba();
                prod.nazivProizvoda = formValues.nazivProizvoda;
                prod.cena = parseFloat(formValues.cena);
                prod.tipProizvoda = TipProizvoda.Farba;
                prod.boja = formValues.boja;
                prod.velicinaPakovanja = parseFloat(formValues.velicinaPakovanja);
            }

            if(formValues.tipProizvoda == TipProizvoda.Plocice.toString()){
                prod = new Plocice();
                prod.nazivProizvoda = formValues.nazivProizvoda;
                prod.cena = parseFloat(formValues.cena);
                prod.tipProizvoda = TipProizvoda.Plocice;
                prod.materijal = formValues.materijal;
                prod.sirina = parseFloat(formValues.sirina);
                prod.duzina = parseFloat(formValues.duzina);
            }

            prod.sifraProizvoda = product?.sifraProizvoda;

            console.log("Proizvod: ", prod);

            try {
                if(product){
                    const response = await apiService.updateProduct(prod);
                    toast.success('Proizvod je uspešno izmenjen!');
                    setTimeout(()=>{navigate('/products')}, 1500);
                } else{
                    const response = await apiService.createProduct(prod);
                    toast.success('Proizvod je uspešno kreiran!');
                    setTimeout(()=>{navigate('/')}, 1500);
                }
            } catch (error) {
                toast.error(`Došlo je do greške prilikom kreiranja prodavca: ${error.response.data}`);
            }
        }
    };

    return (
        <div className="product-form-container">
            <Toaster />
            <form className="product-form">
                <div className="form-group">
                    <label>Naziv proizvoda</label>
                    <input 
                        type="text" 
                        name="nazivProizvoda" 
                        value={formValues.nazivProizvoda} 
                        onChange={handleProductChange} 
                        required
                    />
                    {errors.nazivProizvoda && <span className="error">{errors.nazivProizvoda}</span>}
                </div>

                <div className="form-group">
                    <label>Cena</label>
                    <input 
                        type="text" 
                        name="cena" 
                        value={formValues.cena} 
                        onChange={handleProductChange}
                        required
                    />
                    {errors.cena && <span className="error">{errors.cena}</span>}
                </div>

                <div className="form-group">
                    <label>Tip proizvoda</label>
                    <select name="tipProizvoda" value={formValues.tipProizvoda} onChange={handleProductChange} required disabled={!!product}>
                        <option value={''}>Izaberite tip proizvoda</option>
                        <option value={TipProizvoda.Plocice}>Pločice</option>
                        <option value={TipProizvoda.Farba}>Farba</option>
                        <option value={TipProizvoda.Alat}>Alat</option>
                    </select>
                    {errors.tipProizvoda && <span className="error">{errors.tipProizvoda}</span>}
                </div>

                {formValues.tipProizvoda == TipProizvoda.Plocice.toString() && (
                    <>
                        <div className="form-group">
                            <label>Materijal</label>
                            <input 
                                type="text" 
                                name="materijal" 
                                value={formValues.materijal} 
                                onChange={handleProductChange}
                                required
                            />
                            {errors.materijal && <span className="error">{errors.materijal}</span>}
                        </div>
                        <div className="form-group">
                            <label>Dužina</label>
                            <input 
                                type="text" 
                                name="duzina" 
                                value={formValues.duzina} 
                                onChange={handleProductChange}
                                required
                            />
                            {errors.duzina && <span className="error">{errors.duzina}</span>}
                        </div>
                        <div className="form-group">
                            <label>Širina</label>
                            <input 
                                type="text" 
                                name="sirina" 
                                value={formValues.sirina} 
                                onChange={handleProductChange}
                                required
                            />
                            {errors.sirina && <span className="error">{errors.sirina}</span>}
                        </div>
                    </>
                )}

                {formValues.tipProizvoda == TipProizvoda.Farba.toString() && (
                    <>
                        <div className="form-group">
                            <label>Boja</label>
                            <input 
                                type="text" 
                                name="boja" 
                                value={formValues.boja} 
                                onChange={handleProductChange}
                                required
                            />
                            {errors.boja && <span className="error">{errors.boja}</span>}
                        </div>
                        <div className="form-group">
                            <label>Veličina pakovanja</label>
                            <input 
                                type="text" 
                                name="velicinaPakovanja" 
                                value={formValues.velicinaPakovanja} 
                                onChange={handleProductChange}
                                required
                            />
                            {errors.velicinaPakovanja && <span className="error">{errors.velicinaPakovanja}</span>}
                        </div>
                    </>
                )}

                {formValues.tipProizvoda == TipProizvoda.Alat.toString() && (
                    <div className="form-group">
                        <label>Tip alata</label>
                        <select name="tipAlata" value={formValues.tipAlata} onChange={handleProductChange}>
                            <option value={''}>Izaberite tip alata</option>
                            <option value={TipAlata.Elektricni}>Električni</option>
                            <option value={TipAlata.Klasicni}>Klasični</option>
                        </select>
                        {errors.tipAlata && <span className="error">{errors.tipAlata}</span>}
                    </div>
                )}

                <div className="form-buttons">
                    <button type="button" onClick={() => navigate('/')}>Odustani</button>
                    <button type="button" onClick={handleSubmit}>{product ? "Izmeni proizvod" : "Sačuvaj proizvod"}</button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;