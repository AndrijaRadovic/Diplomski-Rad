import { Korisnik } from "./Korisnik";
import { StavkaRacuna } from "./StavkaRacuna";
import { StatusRacuna } from "./StatusRacuna";

export class Racun{
    sifraRacuna: number;
    datumVreme: Date;
    ukupnaCenaRacuna: number;
    korisnik: Korisnik;
    stavkeRacuna: StavkaRacuna[];
    statusRacuna: StatusRacuna;

    constructor(){
        this.sifraRacuna = 0;
        this.datumVreme = new Date();
        this.ukupnaCenaRacuna = 0;
        this.korisnik = new Korisnik();
        this.stavkeRacuna = [];
        this.statusRacuna = 0;
    }
}