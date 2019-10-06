"use strict";
exports.__esModule = true;
var webGLplot_1 = require("./webGLplot");
var webGLplot_2 = require("./webGLplot");
var webGLplot_3 = require("./webGLplot");
var noUiSlider = require("nouislider");
var spad_1 = require("./spad");
var N = 1000;
var phrate = 10;
var tr = 0.02;
var vth = 0.5;
var flag_vth = false;
var flag_CH1 = true;
var flag_CH2 = false;
var run_single = false;
var update_new_ph = true;
var update_ch1 = true;
var update_ch2 = false;
var canv = document.getElementById("display");
var devicePixelRatio = window.devicePixelRatio || 1;
var num = Math.round(canv.clientWidth * devicePixelRatio);
var yscale = 1;
var fps_divder = 6;
var fps_counter = 0;
var wglp = new webGLplot_1.webGLplot(canv);
wglp.clear();
var color = new webGLplot_2.color_rgba(0, 1, 1, 1);
var line = new webGLplot_3.lineGroup(color, 1000);
line.linespaceX();
wglp.add_line(line);
//gr.polyline(1000, tplot, yplot);
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
document.getElementById("bt-run").addEventListener("onclick", ctrl_run);
document.getElementById("bt-single").addEventListener("onclick", ctrl_single);
update_ui();
var spad = new spad_1.SPAD(1000);
var tplot = spad.t.tolist();
function new_frame() {
    if (fps_counter == 0) {
        update(true, true, false);
        wglp.linegroups.forEach(function (line) {
            //
        });
        wglp.clear();
        wglp.update_add();
        wglp.scaleY = yscale;
    }
    fps_counter++;
    if (fps_counter >= fps_divder) {
        fps_counter = 0;
    }
    window.requestAnimationFrame(new_frame);
}
window.requestAnimationFrame(new_frame);
slider_tr.noUiSlider.on("update", function (values, handle) {
    tr = parseFloat(values[handle]) / 10;
    document.getElementById("display_tr").innerHTML = tr.toString();
    //run_single = true;
});
slider_phrate.noUiSlider.on("update", function (values, handle) {
    phrate = parseFloat(values[handle]);
    document.getElementById("display_phrate").innerHTML = phrate.toString();
    spad.generate_photon(phrate);
    //run_single = true;
});
slider_vth.noUiSlider.on("update", function (values, handle) {
    vth = parseFloat(values[handle]);
    document.getElementById("display_vth").innerHTML = vth.toString();
});
slider_tr.noUiSlider.on("start", function (values, handle) { slider_start(); });
slider_tr.noUiSlider.on("end", function (values, handle) { slider_end(); });
slider_phrate.noUiSlider.on("start", function (values, handle) { slider_start(); });
slider_phrate.noUiSlider.on("end", function (values, handle) { slider_end(); });
slider_vth.noUiSlider.on("start", function (values, handle) {
    flag_vth = true;
    if (run_single) {
        update_ch1 = false;
        update_ch2 = true;
    }
});
slider_vth.noUiSlider.on("end", function (values, handle) {
    flag_vth = false;
    slider_end();
});
function slider_start() {
    update_ch1 = true;
    update_ch2 = true;
}
function slider_end() {
    if (run_single) {
        update_ch1 = false;
        update_ch2 = false;
    }
}
//plot new set
function update(new_photon, ch1, ch2) {
    if (new_photon) {
        spad.generate_photon(phrate);
    }
    //gr.clearws();
    if (ch1) {
        spad.update_y(tr);
    }
    if (flag_CH1) {
        for (var i = 0; i < 1000; i++) {
            line.xy.set(i, 1, 1.9 * spad.y.get(i, 0) - 0.9);
        }
        //gr.setlinecolorind(430);
        //gr.polyline(1000, tplot, spad.y.tolist());
    }
    if (ch2) {
        spad.update_ysq(vth);
    }
    if (flag_CH2) {
        //gr.setlinecolorind(530);
        //gr.polyline(1000, tplot, spad.ysq.tolist());
        if (flag_vth) {
            //let y = (nj.ones(1000)).multiply(vth);
            //gr.setlinecolorind(550);
            //gr.polyline(1000, tplot, y.tolist());
        }
    }
}
function update_ui() {
    if (update_new_ph) {
        document.getElementById("bt-run").style.backgroundColor = "green";
    }
    else {
        document.getElementById("bt-run").style.backgroundColor = "";
    }
    if (flag_CH1) {
        document.getElementById("btCH1").style.backgroundColor = "yellow";
    }
    else {
        document.getElementById("btCH1").style.backgroundColor = "";
    }
    if (flag_CH2) {
        document.getElementById("btCH2").style.backgroundColor = "green";
    }
    else {
        document.getElementById("btCH2").style.backgroundColor = "";
    }
}
//button function
function ctrl_run() {
    run_single = false;
    update_new_ph = true;
    update_ch1 = true;
    update_ch2 = true;
    document.getElementById("bt-run").style.backgroundColor = "green";
    document.getElementById("bt-single").style.backgroundColor = "";
}
function ctrl_single() {
    console.log("hello!");
    run_single = true;
    update_new_ph = false;
    update_ch1 = false;
    update_ch2 = false;
    update(true, true, true);
    document.getElementById("bt-run").style.backgroundColor = "green";
    document.getElementById("bt-single").style.backgroundColor = "";
    setTimeout(function () {
        document.getElementById("bt-run").style.backgroundColor = "";
        document.getElementById("bt-single").style.backgroundColor = "red";
    }, 200);
}
// CH functions
function btCH1() {
    var bt = document.getElementById("btCH1");
    if (flag_CH1) {
        flag_CH1 = false;
        bt.style.backgroundColor = "";
    }
    else {
        flag_CH1 = true;
        bt.style.backgroundColor = "Yellow";
    }
}
function btCH2() {
    var bt = document.getElementById("btCH2");
    if (flag_CH2) {
        flag_CH2 = false;
        slider_vth.setAttribute("disabled", "true");
        bt.style.backgroundColor = "";
    }
    else {
        flag_CH2 = true;
        slider_vth.removeAttribute("disabled");
        bt.style.backgroundColor = "lightgreen";
    }
}
