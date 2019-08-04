//SPAD object
//by Danial Chitnis
//29/07/2019

import * as nj from "numjs";


/**
 * SPAD CLass function
 */
export class SPAD {
    N: number; //size of the array
    tr: number;
    t:  nj.NdArray;
    timestamps: nj.NdArray;
    y: nj.NdArray;

    /**
     * 
     * @param N 
     */
    constructor(N:number) {
        this.N = N;
        this.t = nj.arange(N);
        this.timestamps = nj.arange(N);
        this.y = nj.zeros(N);

    }
    /**
     * SPAD photon gneration
     * @param phrate photon rate normlised to 1
     */
    generate_photon(phrate:number) {
        let u = nj.random(phrate * 3);
        //let tgap=-(1/phrate)*nj.log(u)*T;
        let tgap = (nj.log(u)).multiply((-1 / phrate) * T);

        this.timestamps = cumsum(tgap);
        
        this.y = (nj.arange(1000)).divide(1000);
        return this.y;
    }
    
    update_y(tr:number):void {
        this.tr = tr;
        let ystep = this.tr;
        let index = 0;
        let y = nj.zeros(this.N);
        let tstep = 1/this.N;

        for (let i = 2; i < this.t.shape[0]; i++) {
            if (i * tstep > this.timestamps.get(index)) {
                let u = nj.random(1).get(0);
                if (u > y.get(i - 1)) {
                y.set(i, 1);
                } else {
                    apply_ystep(y, i, ystep);
                }
                index = index + 1;
            } else {
                apply_ystep(y, i, ystep);
            }
        }
    }
}


function apply_ystep():void {

}


function cumsum(array:nj.NdArray) :nj.NdArray {
    let size = array.shape[0];

    let sum = nj.zeros(size);

    sum.set(0, array.get(0));

    for (let i = 1; i < size; i++) {
        let a = sum.get(i - 1) + array.get(i);
        sum.set(i, a);
    }
    return sum;
}