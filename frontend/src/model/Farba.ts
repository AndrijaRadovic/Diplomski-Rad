import { Proizvod } from "./Proizvod.ts"

export class Farba extends Proizvod{
    boja: string;
    velicinaPakovanja: number;

    constructor(){
        super();
        this.boja = "";
        this.velicinaPakovanja = 0;
    }
}