import { Proizvod } from "./Proizvod.ts";
import { TipAlata } from "./TipAlata.ts"

export class Alat extends Proizvod{
    tipAlata: TipAlata;
    
    constructor(){
        super();
        this.tipAlata = TipAlata.Elektricni;
    }
}