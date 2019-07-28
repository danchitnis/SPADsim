"use strict";

var T = 1;
var phrate = 10;
var tstep = 0.001;
var tr = 0.02;
var vth = 0.5;
var t = nj.arange(T / tstep);
var play = true;
var flag_vth = false;
var flag_new = true;
var flag_CH1 = true;
var flag_CH2 = false;
//main spad results
var y_spad;
var sw_y = document.getElementById("sw_y");
//plot data
var canv = document.getElementById("display");
canv.width = 1000;
canv.height = 400;
var gr = new GR("display");
gr.setviewport(0, 1, 0, 1);
gr.setwindow(1, 1000, 0, 1);
var y = nj.arange(1000);
var tplot = t.tolist();
var yplot = (y.divide(1000)).tolist();
gr.polyline(1000, tplot, yplot);
var slider_tr = document.getElementById('slider_tr');
var slider_phrate = document.getElementById("slider_phrate");
;
var slider_vth = document.getElementById("slider_vth");
;
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
slider_tr.noUiSlider.on("update", function (values, handle) {
    tr = parseFloat(values[handle]) / 10;
    //display_tr.innerHTML = tr;
});
slider_phrate.noUiSlider.on("update", function (values, handle) {
    phrate = parseFloat(values[handle]);
    //display_phrate.innerHTML = phrate;
});
slider_vth.noUiSlider.on("update", function (values, handle) {
    vth = parseFloat(values[handle]);
    //display_thr.innerHTML = vth;
});
slider_vth.noUiSlider.on("start", function (values, handle) {
    flag_vth = true;
    flag_new = false;
    play = true;
});
slider_vth.noUiSlider.on("end", function (values, handle) {
    flag_vth = false;
    flag_new = true;
});
