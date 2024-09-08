import { Proizvod } from "./Proizvod";

export class StavkaRacuna{
    racunId: number;
    redniBroj: number;
    kolicina: number;
    ukupnaCenaStavke: number;
    proizvod: Proizvod;

    constructor(){
        this.racunId = 0;
        this.redniBroj = 0;
        this.kolicina = 0;
        this.ukupnaCenaStavke = 0;
        this.proizvod = new Proizvod();
    }
}