import { Proizvod } from "./Proizvod.ts";

export class Plocice extends Proizvod{
    materijal: string;
    duzina: number;
    sirina: number;

    constructor(){
        super();
        this.materijal = "";
        this.duzina = 0;
        this.sirina = 0;
    }
}