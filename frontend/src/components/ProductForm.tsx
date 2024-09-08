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

const ProductForm: React.FC = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState<Proizvod>(new Proizvod());
    const [plocice, setPlocice] = useState<Plocice | null>(null);
    const [farba, setFarba] = useState<Farba | null>(null);
    const [alat, setAlat] = useState<Alat | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            tipProizvoda: NaN
        }));
    }, []);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!product.nazivProizvoda) newErrors.nazivProizvoda = "Naziv proizvoda je obavezan";
        if (product.cena <= 0 || Number.isNaN(product.cena)) newErrors.cena = "Cena mora biti veća od 0";
        if (!product.tipProizvoda) newErrors.tipProizvoda = "Tip proizvoda je obavezan";

        if (plocice) {
            if (!plocice.materijal) newErrors.materijal = "Materijal je obavezan";
            if (plocice.duzina <= 0 || Number.isNaN(plocice.duzina)) newErrors.duzina = "Dužina mora biti veća od 0";
            if (plocice.sirina <= 0 || Number.isNaN(plocice.sirina)) newErrors.sirina = "Širina mora biti veća od 0";
        }

        if (farba) {
            if (!farba.boja) newErrors.boja = "Boja je obavezna";
            if (farba.velicinaPakovanja <= 0 || Number.isNaN(farba.velicinaPakovanja)) newErrors.velicinaPakovanja = "Veličina pakovanja mora biti veća od 0";
        }

        if (alat && !alat.tipAlata) newErrors.tipAlata = "Tip alata je obavezan";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
        if (name === 'tipProizvoda') {
            const tip = Number(value) as TipProizvoda;
            switch (tip) {
                case TipProizvoda.Plocice:
                    setPlocice(new Plocice());
                    setFarba(null);
                    setAlat(null);
                    break;
                case TipProizvoda.Farba:
                    setFarba(new Farba());
                    setPlocice(null);
                    setAlat(null);
                    break;
                case TipProizvoda.Alat:
                    setAlat(new Alat());
                    setPlocice(null);
                    setFarba(null);
                    break;
                default:
                    setPlocice(null);
                    setFarba(null);
                    setAlat(null);
            }
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        let tipPr;
        var alatZaSlanje = new Alat();
        console.log("cena = " + product.cena);


        if(product.tipProizvoda === TipProizvoda.Alat)
        {
            alatZaSlanje.cena = product.cena;
            alatZaSlanje.nazivProizvoda = product.nazivProizvoda;
            alatZaSlanje.tipAlata = alat ? alat.tipAlata : NaN;
            alatZaSlanje.tipProizvoda = product ? product.tipProizvoda : NaN;


            tipPr = TipProizvoda.Alat;
        }

        if(product.tipProizvoda === TipProizvoda.Farba)
        {
            setFarba({...farba, 
                cena: product.cena,
                nazivProizvoda: product.nazivProizvoda,
                sifraProizvoda: product.sifraProizvoda,
                tipProizvoda: product.tipProizvoda,
                boja: farba ? farba.boja : "",
                velicinaPakovanja: farba ? farba.velicinaPakovanja : NaN
            });

            tipPr = TipProizvoda.Farba;
        }

        if(product.tipProizvoda === TipProizvoda.Plocice)
        {
            setPlocice({...plocice, 
                cena: product.cena,
                nazivProizvoda: product.nazivProizvoda,
                sifraProizvoda: product.sifraProizvoda,
                tipProizvoda: product.tipProizvoda,
                duzina: plocice ? plocice.duzina : NaN,
                sirina: plocice ? plocice.sirina : NaN,
                materijal: plocice ? plocice.materijal : ""
            })
            tipPr = TipProizvoda.Plocice;
        }

        try {
            console.log(product);
            console.log(alatZaSlanje);
            console.log(farba);
            console.log(plocice);
            // console.log(TipProizvoda.Alat);
            await apiService.createProduct(product);
            toast.success("Proizvod je uspešno kreiran!");
            setTimeout(()=>{navigate('/')}, 1500);
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error("Došlo je do greške prilikom kreiranja proizvoda.");
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
                        value={product.nazivProizvoda} 
                        onChange={handleProductChange} 
                        required
                    />
                    {errors.nazivProizvoda && <span className="error">{errors.nazivProizvoda}</span>}
                </div>

                <div className="form-group">
                    <label>Cena</label>
                    <input 
                        type="number" 
                        name="cena" 
                        value={product.cena} 
                        onChange={handleProductChange} 
                        min='0'
                        onFocus={(e) => {
                            if (product.cena === 0) {
                                setProduct({ ...product, cena: NaN });
                            }
                        }}
                        required
                    />
                    {errors.cena && <span className="error">{errors.cena}</span>}
                </div>

                <div className="form-group">
                    <label>Tip proizvoda</label>
                    <select name="tipProizvoda" value={product.tipProizvoda || ''} onChange={handleProductChange} required>
                        <option value={NaN}>Izaberite tip proizvoda</option>
                        <option value={TipProizvoda.Plocice}>Pločice</option>
                        <option value={TipProizvoda.Farba}>Farba</option>
                        <option value={TipProizvoda.Alat}>Alat</option>
                    </select>
                    {errors.tipProizvoda && <span className="error">{errors.tipProizvoda}</span>}
                </div>

                {plocice && (
                    <>
                        <div className="form-group">
                            <label>Materijal</label>
                            <input 
                                type="text" 
                                name="materijal" 
                                value={plocice.materijal} 
                                onChange={(e) => setPlocice({ ...plocice, materijal: e.target.value })}
                                required
                            />
                            {errors.materijal && <span className="error">{errors.materijal}</span>}
                        </div>
                        <div className="form-group">
                            <label>Dužina</label>
                            <input 
                                type="number" 
                                name="duzina" 
                                value={plocice.duzina} 
                                onChange={(e) => setPlocice({ ...plocice, duzina: parseFloat(e.target.value) })}
                                min = '0'
                                onFocus={(e) => {
                                    if (plocice.duzina === 0) {
                                        setPlocice({ ...plocice, duzina: NaN });
                                    }
                                }}
                                required
                            />
                            {errors.duzina && <span className="error">{errors.duzina}</span>}
                        </div>
                        <div className="form-group">
                            <label>Širina</label>
                            <input 
                                type="number" 
                                name="sirina" 
                                value={plocice.sirina} 
                                onChange={(e) => setPlocice({ ...plocice, sirina: parseFloat(e.target.value) })}
                                min='0'
                                onFocus={(e) => {
                                    if (plocice.sirina === 0) {
                                        setPlocice({ ...plocice, sirina: NaN });
                                    }
                                }}
                                required
                            />
                            {errors.sirina && <span className="error">{errors.sirina}</span>}
                        </div>
                    </>
                )}

                {farba && (
                    <>
                        <div className="form-group">
                            <label>Boja</label>
                            <input 
                                type="text" 
                                name="boja" 
                                value={farba.boja} 
                                onChange={(e) => setFarba({ ...farba, boja: e.target.value })}
                                required
                            />
                            {errors.boja && <span className="error">{errors.boja}</span>}
                        </div>
                        <div className="form-group">
                            <label>Veličina pakovanja</label>
                            <input 
                                type="number" 
                                name="velicinaPakovanja" 
                                value={farba.velicinaPakovanja} 
                                onChange={(e) => setFarba({ ...farba, velicinaPakovanja: parseFloat(e.target.value) })}
                                min='0'
                                onFocus={(e) => {
                                    if (farba.velicinaPakovanja === 0) {
                                        setFarba({ ...farba, velicinaPakovanja: NaN });
                                    }
                                }}
                                required
                            />
                            {errors.velicinaPakovanja && <span className="error">{errors.velicinaPakovanja}</span>}
                        </div>
                    </>
                )}

                {alat && (
                    <div className="form-group">
                        <label>Tip alata</label>
                        <select name="tipAlata" value={alat.tipAlata || ''} onChange={(e) => setAlat({ ...alat, tipAlata: Number(e.target.value) })}>
                            {/* <option value={NaN}>Izaberite tip alata</option> */}
                            <option value={TipAlata.Elektricni}>Električni</option>
                            <option value={TipAlata.Klasicni}>Klasični</option>
                        </select>
                        {errors.tipAlata && <span className="error">{errors.tipAlata}</span>}
                    </div>
                )}

                <div className="form-buttons">
                    <button type="button" onClick={() => navigate('/')}>Odustani</button>
                    <button type="button" onClick={handleSubmit}>Sačuvaj proizvod</button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Proizvod } from '../model/Proizvod.ts';
// import { Plocice } from '../model/Plocice.ts';
// import { Farba } from '../model/Farba.ts';
// import { Alat } from '../model/Alat.ts';
// import { TipProizvoda } from '../model/TipProizvoda.ts';
// import { TipAlata } from '../model/TipAlata.ts';
// import { apiService } from '../components/ApiService';
// import '../styles/ProductForm.css';
// import { Toaster, toast } from 'react-hot-toast';

// const ProductForm: React.FC = () => {
//     const navigate = useNavigate();
//     // const [product, setProduct] = useState<Proizvod>(new Proizvod());
//     const [product, setProduct] = useState({
//         tipProizvoda: '', // ili TipProizvoda.Plocice za default
//         // drugi atributi proizvoda
//     });
//     const [plocice, setPlocice] = useState<Plocice | null>(null);
//     const [farba, setFarba] = useState<Farba | null>(null);
//     // const [alat, setAlat] = useState<Alat | null>(null);
//     const [alat, setAlat] = useState({
//         tipAlata: '', // ili TipAlata.Klasicni za default
//         // drugi atributi alata
//     });
//     // const [errors, setErrors] = useState<{ [key: string]: string }>({});
//     const [errors, setErrors] = useState({
//         tipProizvoda: '',
//         tipAlata: ''
//     });
//     // Inicijalno stanje za proizvod i alat


//     const validate = () => {
//         const newErrors: { [key: string]: string } = {};

//         if (!product.nazivProizvoda) newErrors.nazivProizvoda = "Naziv proizvoda je obavezan";
//         if (String(product.cena) === '' || isNaN(Number(product.cena)) || Number(product.cena) <= 0) newErrors.cena = "Cena mora biti broj veći od 0";
//         if (!product.tipProizvoda) newErrors.tipProizvoda = "Tip proizvoda je obavezan";

//         if (plocice) {
//             if (!plocice.materijal) newErrors.materijal = "Materijal je obavezan";
//             if (String(plocice.duzina) === '' || isNaN(Number(plocice.duzina)) || Number(plocice.duzina) <= 0) newErrors.duzina = "Dužina mora biti broj veći od 0";
//             if (String(plocice.sirina) === '' || isNaN(Number(plocice.sirina)) || Number(plocice.sirina) <= 0) newErrors.sirina = "Širina mora biti broj veći od 0";
//         }

//         if (farba) {
//             if (!farba.boja) newErrors.boja = "Boja je obavezna";
//             if (String(farba.velicinaPakovanja) === '' || isNaN(Number(farba.velicinaPakovanja)) || Number(farba.velicinaPakovanja) <= 0) newErrors.velicinaPakovanja = "Veličina pakovanja mora biti broj veći od 0";
//         }

//         if (alat && !alat.tipAlata) newErrors.tipAlata = "Tip alata je obavezan";

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setProduct({ ...product, [name]: value });
//         if (name === 'tipProizvoda') {
//             const tip = Number(value) as TipProizvoda;
//             switch (tip) {
//                 case TipProizvoda.Plocice:
//                     setPlocice(new Plocice());
//                     setFarba(null);
//                     setAlat(null);
//                     break;
//                 case TipProizvoda.Farba:
//                     setFarba(new Farba());
//                     setPlocice(null);
//                     setAlat(null);
//                     break;
//                 case TipProizvoda.Alat:
//                     setAlat(new Alat());
//                     setPlocice(null);
//                     setFarba(null);
//                     break;
//                 default:
//                     setPlocice(null);
//                     setFarba(null);
//                     setAlat(null);
//             }
//         }
//     };

//     const handleSubmit = async () => {
//         if (!validate()) return;

//         try {
//             await apiService.createProduct(product);
//             toast.success("Proizvod je uspešno kreiran!");
//             setTimeout(() => { navigate('/') }, 1500);
//         } catch (error) {
//             console.error('Error creating product:', error);
//             toast.error("Došlo je do greške prilikom kreiranja proizvoda.");
//         }
//     };

//     return (
//         <div className="form-container">
//             <Toaster />
//             <form className="product-form">
//                 <div className="form-group">
//                     <label>Naziv proizvoda</label>
//                     <input 
//                         type="text" 
//                         name="nazivProizvoda" 
//                         value={product.nazivProizvoda} 
//                         onChange={handleProductChange} 
//                         required
//                     />
//                     {errors.nazivProizvoda && <span className="error">{errors.nazivProizvoda}</span>}
//                 </div>

//                 <div className="form-group">
//                     <label>Cena</label>
//                     <input 
//                         type="text" 
//                         name="cena" 
//                         value={product.cena} 
//                         onChange={handleProductChange} 
//                         inputMode="numeric"
//                         pattern="[0-9]*"
//                         required
//                     />
//                     {errors.cena && <span className="error">{errors.cena}</span>}
//                 </div>

//                 <div className="form-group">
//                     <label>Tip proizvoda</label>
//                     <select name="tipProizvoda" value={product.tipProizvoda || ''} onChange={handleProductChange} required>
//                         <option value="">Izaberite tip proizvoda</option>
//                         <option value={TipProizvoda.Plocice}>Pločice</option>
//                         <option value={TipProizvoda.Farba}>Farba</option>
//                         <option value={TipProizvoda.Alat}>Alat</option>
//                     </select>
//                     {errors.tipProizvoda && <span className="error">{errors.tipProizvoda}</span>}
//                 </div>

//                 {plocice && (
//                     <>
//                         <div className="form-group">
//                             <label>Materijal</label>
//                             <input 
//                                 type="text" 
//                                 name="materijal" 
//                                 value={plocice.materijal} 
//                                 onChange={(e) => setPlocice({ ...plocice, materijal: e.target.value })}
//                                 required
//                             />
//                             {errors.materijal && <span className="error">{errors.materijal}</span>}
//                         </div>
//                         <div className="form-group">
//                             <label>Dužina</label>
//                             <input 
//                                 type="text" 
//                                 name="duzina" 
//                                 value={plocice.duzina} 
//                                 onChange={(e) => setPlocice({ ...plocice, duzina: parseFloat(e.target.value) })}
//                                 inputMode="numeric"
//                                 pattern="[0-9]*"
//                                 required
//                             />
//                             {errors.duzina && <span className="error">{errors.duzina}</span>}
//                         </div>
//                         <div className="form-group">
//                             <label>Širina</label>
//                             <input 
//                                 type="text" 
//                                 name="sirina" 
//                                 value={plocice.sirina} 
//                                 onChange={(e) => setPlocice({ ...plocice, sirina: parseFloat(e.target.value) })}
//                                 inputMode="numeric"
//                                 pattern="[0-9]*"
//                                 required
//                             />
//                             {errors.sirina && <span className="error">{errors.sirina}</span>}
//                         </div>
//                     </>
//                 )}

//                 {farba && (
//                     <>
//                         <div className="form-group">
//                             <label>Boja</label>
//                             <input 
//                                 type="text" 
//                                 name="boja" 
//                                 value={farba.boja} 
//                                 onChange={(e) => setFarba({ ...farba, boja: e.target.value })}
//                                 required
//                             />
//                             {errors.boja && <span className="error">{errors.boja}</span>}
//                         </div>
//                         <div className="form-group">
//                             <label>Veličina pakovanja</label>
//                             <input 
//                                 type="text" 
//                                 name="velicinaPakovanja" 
//                                 value={farba.velicinaPakovanja} 
//                                 onChange={(e) => setFarba({ ...farba, velicinaPakovanja: parseFloat(e.target.value) })}
//                                 inputMode="numeric"
//                                 pattern="[0-9]*"
//                                 required
//                             />
//                             {errors.velicinaPakovanja && <span className="error">{errors.velicinaPakovanja}</span>}
//                         </div>
//                     </>
//                 )}

//                 {alat && (
//                     <div className="form-group">
//                         <label>Tip alata</label>
//                         <select name="tipAlata" value={alat.tipAlata || ''} onChange={(e) => setAlat({ ...alat, tipAlata: Number(e.target.value) as TipAlata })} required>
//                             <option value="">Izaberite tip alata</option>
//                             <option value={TipAlata.Elektricni}>Električni</option>
//                             <option value={TipAlata.Klasicni}>Klasični</option>
//                         </select>
//                         {errors.tipAlata && <span className="error">{errors.tipAlata}</span>}
//                     </div>
//                 )}

//                     <div className="form-buttons">
//                         <button type="button" onClick={() => navigate('/')}>Odustani</button>
//                         <button type="button" onClick={handleSubmit}>Sačuvaj proizvod</button>
//                     </div>
//             </form>
//         </div>
//     );
// };

// export default ProductForm;
