//SPAD object
//by Danial Chitnis
//29/07/2019

import * as nj from "numjs";


/**
 * SPAD CLass function
 */
export class SPAD {
    N: number; 
    tr: number;
    t:  nj.NdArray;
    timestamps: nj.NdArray;
    y: nj.NdArray;
    ysq: nj.NdArray;

    /**
     * 
     * @param N the number of datapoints in time
     */
    constructor(N:number) {
        this.N = N;
        this.t = nj.arange(N);
        this.tr = 0;
        this.timestamps = nj.arange(N);
        this.y = nj.zeros(N);
        this.ysq = nj.zeros(N);

    }
    /**
     * SPAD photon gneration
     * @param phrate photon rate normlised to 1
     */
    generate_photon(phrate:number):void {
        let u = nj.random(phrate * 3);
        //let tgap=-(1/phrate)*nj.log(u)*T;
        let tgap = (nj.log(u)).multiply(-1 / phrate);

        this.timestamps = cumsum(tgap);
    }
    
    /**
     * generate the y values based on the recovery time. 
     * run generate photon first
     * @param tr the recovery time
     */
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
        this.y = y;
    }

    /**
     * Do the square thresholding
     * @param vthr the voltage threshold value from 0 to 1 range
     */
    sq(vthr:number):void {
        let ysq = nj.zeros(this.N);
        for (let i = 0; i < this.y.shape[0]; i++) {
            if (this.y.get(i) < vthr) {
                ysq.set(i, 0);
            } else {
                ysq.set(i, 1);
            }
        }
        this.ysq = ysq;
    }
    
}


function apply_ystep(y:nj.NdArray, i:number, ystep:number):void{
    if (y.get(i - 1) > 0) {
      let a = y.get(i - 1) - ystep;
      y.set(i, a);
    } else {
      y.set(i, 0);
    }
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