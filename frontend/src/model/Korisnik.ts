import { Pol } from "./Pol";
import { Uloga } from "./Uloga";

export class Korisnik{
    sifraKorisnika: number;
    ime: string;
    prezime: string;
    pol: Pol;
    uloga: Uloga;
    username: string;
    password: string;
    jmbg: string;
    email: string;
    brojTelefona: string;
    token: string;

    constructor(){
        this.sifraKorisnika = 0;
        this.ime = "";
        this.prezime = "";
        this.pol = 0;
        this.uloga = 1;
        this.username = "";
        this.password = "";
        this.jmbg = "";
        this.email = "";
        this.brojTelefona = "";
        this.token = "";
    }
}