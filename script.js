//SPAD simulation
// Danial Chitnis
// 01/07/2019

let T = 1;
let phrate = 10;
let tstep = 0.001;
let tr = 0.02;

let t = nj.arange(T/tstep);

let play = true;


//plot data
let canv = document.getElementById('display');
canv.width = 1000; 
canv.height = 400;

let gr = new GR('display');

gr.setviewport(0, 1, 0, 1);
gr.setwindow(1, 1000, 0, 1);
gr.setlinecolorind(500);

let slider = document.getElementById('slider');

noUiSlider.create(slider, {
    start: [0.5],
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
        'min': 0.01,
        'max': 1
    }
});

slider.noUiSlider.on('update', function (values, handle) {
    tr = parseFloat(values[handle]) / 10;
    range_display.innerHTML = tr;
    
});


//generate_new();

setInterval(function() {
    if (play) {
        generate_new();
    }
  }, 100);




//button function
function ctrl_play() {
    play = true;
}

function ctrl_pause() {
    play = false;
}

function ctrl_step() {
    play = false;
    generate_new();
}


//plot new set
function generate_new() {
    let y = spad(t, tr);
    let yplot=y.tolist();
    let tplot=t.tolist();

    //plot in gr canvas
    gr.clearws();
    
    gr.polyline(1000, tplot, yplot);
    //gr.updatews();
}

///// functions

function spad(t, tr) {
    //
    let u=nj.random(phrate*3);
    //let tgap=-(1/phrate)*nj.log(u)*T;
    let tgap = (nj.log(u)).multiply((-1/phrate)*T);

    let timestamps = cumsum(tgap);

    
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




function apply_ystep(y, i, ystep) {
    if (y.get(i-1) > 0) {
        let a = y.get(i-1) - ystep;
        y.set(i, a);
    }
    else {
        y.set(i,0);
    }
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


