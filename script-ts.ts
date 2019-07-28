import * as nj from "numjs";
import * as noUiSlider from "nouislider";
import GR from "grframework";



let T = 1;
let phrate = 10;
let tstep = 0.001;
let tr = 0.02;
let vth = 0.5;

let t = nj.arange(T / tstep);

let play = true;

let flag_vth = false;
let flag_new = true;
let flag_CH1 = true;
let flag_CH2 = false;

//main spad results
let y_spad:nj.NdArray;

let sw_y = document.getElementById("sw_y");

//plot data
let canv = <HTMLCanvasElement>document.getElementById("display");
canv.width = 1000;
canv.height = 400;

let gr = new GR("display");

gr.setviewport(0, 1, 0, 1);
gr.setwindow(1, 1000, 0, 1);

let y=nj.arange(1000);

let tplot = t.tolist();
let yplot = (y.divide(1000)).tolist();

gr.polyline(1000, tplot, yplot);

let slider_tr = document.getElementById('slider_tr') as noUiSlider.Instance;
let slider_phrate = document.getElementById("slider_phrate") as noUiSlider.Instance;;
let slider_vth = document.getElementById("slider_vth") as noUiSlider.Instance;;

noUiSlider.create(slider_tr, {
    start: [0.5],
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0.01,
      max: 1
    }
});
  
noUiSlider.create(slider_phrate, {
    start: [10],
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0.1,
      max: 100
    }
});
  
  //slider_vth.style.visibility = "hidden";
slider_vth.setAttribute("disabled", "true");
noUiSlider.create(slider_vth, {
    start: [0.5],
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
      min: 0.01,
      max: 1
    }
});



slider_tr.noUiSlider.on("update", function(values, handle) {
    tr = parseFloat(values[handle]) / 10;
    //display_tr.innerHTML = tr;
  });
  
  slider_phrate.noUiSlider.on("update", function(values, handle) {
    phrate = parseFloat(values[handle]);
    //display_phrate.innerHTML = phrate;
  });
  
  slider_vth.noUiSlider.on("update", function(values, handle) {
    vth = parseFloat(values[handle]);
    //display_thr.innerHTML = vth;
  });
  
  slider_vth.noUiSlider.on("start", function(values, handle) {
    flag_vth = true;
    flag_new = false;
    play = true;
  });
  
  slider_vth.noUiSlider.on("end", function(values, handle) {
    flag_vth = false;
    flag_new = true;
  });
  
