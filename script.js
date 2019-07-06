//SPAD simulation
// Danial Chitnis
// 01/07/2019

let T = 1;
let phrate = 50;
let tstep = 0.001;

let t = nj.arange(T/tstep);

let y = spad(t,0.02);

console.log(y);




function spad(t, tr) {
    //
    let u=nj.random(phrate*3);
    //let tgap=-(1/phrate)*nj.log(u)*T;
    let tgap = (nj.log(u)).multiply((-1/phrate)*T);

    console.log(tgap);

    let timestamps = cumsum(tgap);

    console.log(timestamps);
    
    let ystep = tr;
    let index = 0;
    let y=nj.zeros(T/tstep);

    for (let i=2; i<t.shape[0]; i++) {
        if ( i*tstep > timestamps.get(index) ) {
            let u = (nj.random(1)).get(0);
            if (u > y.get(i-1)) {
                y.set(i,1);
            }
            else {
                apply_ystep(y, i, ystep);
            }
            index = index + 1;
        }
        else {
            apply_ystep(y, i, ystep);
        }

    }

    return y;
}




///// functions

function apply_ystep(y, i, c) {
    y.set(i,0.5);
}

function cumsum(array) {
    let size = array.shape[0];
    
    let sum = nj.zeros(size);

    sum.set(0,array.get(0));

    for (let i=1; i < size; i++) {
        let a = sum.get(i-1) + array.get(i);
        sum.set(i, a);
    }
    return sum;
}


