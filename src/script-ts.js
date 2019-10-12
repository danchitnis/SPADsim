"use strict";
exports.__esModule = true;
var webgl_plot_1 = require("webgl-plot");
var webgl_plot_2 = require("webgl-plot");
var webgl_plot_3 = require("webgl-plot");
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
var update_ch2 = true;
var canv = document.getElementById("display");
var devicePixelRatio = window.devicePixelRatio || 1;
var num = Math.round(canv.clientWidth * devicePixelRatio);
var yscale = 1;
var fps_divder = 6;
var fps_counter = 0;
var wglp;
var line_y;
var line_ysq;
var line_vth;
init();
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
document.getElementById("bt-run").addEventListener("click", ctrl_run);
document.getElementById("bt-single").addEventListener("click", ctrl_single);
document.getElementById("btCH1").addEventListener("click", btCH1);
document.getElementById("btCH2").addEventListener("click", btCH2);
update_ui();
var spad = new spad_1.SPAD(1000);
var tplot = spad.t.tolist();
function new_frame() {
    if (fps_counter == 0) {
        update(update_new_ph, update_ch1, update_ch2);
        wglp.linegroups.forEach(function (line) {
            //
        });
        wglp.clear();
        wglp.update();
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
    if (ch1) {
        spad.update_y(tr);
    }
    if (flag_CH1) {
        for (var i = 0; i < 1000; i++) {
            line_y.xy.set(i, 1, 1.9 * spad.y.get(i, 0) - 0.9);
        }
    }
    if (ch2) {
        spad.update_ysq(vth);
    }
    if (flag_CH2) {
        for (var i = 0; i < 1000; i++) {
            line_ysq.xy.set(i, 1, 1.9 * spad.ysq.get(i, 0) - 0.9);
        }
        if (flag_vth) {
            line_vth.visible = true;
            for (var i = 0; i < 1000; i++) {
                line_vth.constY(1.9 * vth - 0.9);
            }
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
        line_y.visible = false;
    }
    else {
        flag_CH1 = true;
        bt.style.backgroundColor = "Yellow";
        line_y.visible = true;
    }
}
function btCH2() {
    var bt = document.getElementById("btCH2");
    if (flag_CH2) {
        flag_CH2 = false;
        slider_vth.setAttribute("disabled", "true");
        bt.style.backgroundColor = "";
        line_ysq.visible = false;
    }
    else {
        flag_CH2 = true;
        slider_vth.removeAttribute("disabled");
        bt.style.backgroundColor = "lightgreen";
        line_ysq.visible = true;
    }
}
function init() {
    wglp = new webgl_plot_1.webGLplot(canv);
    wglp.clear();
    var color = new webgl_plot_2.color_rgba(0, 1, 1, 1);
    line_y = new webgl_plot_3.lineGroup(color, 1000);
    line_y.linespaceX();
    line_y.visible = true;
    wglp.add_line(line_y);
    line_ysq = new webgl_plot_3.lineGroup(new webgl_plot_2.color_rgba(0, 1, 0, 1), 1000);
    line_ysq.linespaceX();
    line_ysq.visible = false;
    wglp.add_line(line_ysq);
    line_vth = new webgl_plot_3.lineGroup(new webgl_plot_2.color_rgba(1, 1, 0, 1), 1000);
    line_vth.linespaceX();
    line_vth.visible = false;
    wglp.add_line(line_vth);
}
