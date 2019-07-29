//SPAD object
//by Danial Chitnis
//29/07/2019

import * as nj from "numjs";



export class SPAD {
    tr: number;
    t:  nj.NdArray;
    y: nj.NdArray;
    constructor(tr:number) {
        this.tr = tr;
        this.t = nj.arange(1000);
        this.y = nj.zeros(1000);

    }
    generate() {
        this.y = (nj.arange(1000)).divide(1000);
        return this.y;
    }
}