import { TipProizvoda } from "./TipProizvoda.ts";

export class Proizvod{
    sifraProizvoda: number;
    nazivProizvoda: string;
    cena: number;
    tipProizvoda: TipProizvoda;

    constructor(){
        this.sifraProizvoda = 0;
        this.nazivProizvoda = "";
        this.cena = 0;
        this.tipProizvoda = TipProizvoda.Alat;
    }
}