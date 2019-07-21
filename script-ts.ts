import * as nj from "numjs";
import * as GR from "gr-latest.js";


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
let y_spad;

let sw_y = document.getElementById("sw_y");

//plot data
let canv = document.getElementById("display");
canv.width = 1000;
canv.height = 400;

let gr = new GR("display");

gr.setviewport(0, 1, 0, 1);
gr.setwindow(1, 1000, 0, 1);

