//SPAD simulation
// Danial Chitnis
// 01/07/2019

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

let slider_tr = document.getElementById("slider_tr");
let slider_phrate = document.getElementById("slider_phrate");
let slider_vth = document.getElementById("slider_vth");

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
slider_vth.setAttribute("disabled", true);
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
  display_tr.innerHTML = tr;
});

slider_phrate.noUiSlider.on("update", function(values, handle) {
  phrate = parseFloat(values[handle]);
  display_phrate.innerHTML = phrate;
});

slider_vth.noUiSlider.on("update", function(values, handle) {
  vth = parseFloat(values[handle]);
  display_thr.innerHTML = vth;
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

//generate_new();

setInterval(function() {
  if (play) {
    generate(flag_new);
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
  generate(flag_new);
}

//plot new set
function generate(flag) {
  if (flag) {
    y_spad = spad(t, tr);
  }

  let ysq = sq(y_spad, vth);

  let tplot = t.tolist();
  let yplot = y_spad.tolist();
  let ysqplot = ysq.tolist();
  //plot in gr canvas
  gr.clearws();

  if (flag_CH1) {
    gr.setlinecolorind(430);
    gr.polyline(1000, tplot, yplot);
  }

  if (flag_CH2) {
    gr.setlinecolorind(500);
    gr.polyline(1000, tplot, ysqplot);
  }

  if (flag_vth) {
    let line = nj.ones(1000).multiply(vth);
    let line_plot = line.tolist();
    gr.setlinecolorind(550);
    gr.polyline(1000, tplot, line_plot);
  }
  //gr.updatews();
}

//switches
function btCH1() {
  bt = document.getElementById("btCH1");
  if (flag_CH1) {
    flag_CH1 = false;
    bt.style.color = "";
  } else {
    flag_CH1 = true;
    bt.style.color = "Yellow";
  }
}

function btCH2() {
  bt = document.getElementById("btCH2");
  if (flag_CH2) {
    flag_CH2 = false;
    slider_vth.setAttribute("disabled", true);
    bt.style.color = "";
  } else {
    flag_CH2 = true;
    slider_vth.removeAttribute("disabled");
    bt.style.color = "lightgreen";
  }
}

///// functions

function spad(t, tr) {
  //
  let u = nj.random(phrate * 3);
  //let tgap=-(1/phrate)*nj.log(u)*T;
  let tgap = nj.log(u).multiply((-1 / phrate) * T);

  let timestamps = cumsum(tgap);

  let ystep = tr;
  let index = 0;
  let y = nj.zeros(T / tstep);

  for (let i = 2; i < t.shape[0]; i++) {
    if (i * tstep > timestamps.get(index)) {
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

  return y;
}

function apply_ystep(y, i, ystep) {
  if (y.get(i - 1) > 0) {
    let a = y.get(i - 1) - ystep;
    y.set(i, a);
  } else {
    y.set(i, 0);
  }
}

function cumsum(array) {
  let size = array.shape[0];

  let sum = nj.zeros(size);

  sum.set(0, array.get(0));

  for (let i = 1; i < size; i++) {
    let a = sum.get(i - 1) + array.get(i);
    sum.set(i, a);
  }
  return sum;
}

function sq(y, thr) {
  let ysq = nj.zeros(T / tstep);

  for (let i = 0; i < y.shape[0]; i++) {
    if (y.get(i) < thr) {
      ysq.set(i, 0);
    } else {
      ysq.set(i, 1);
    }
  }

  return ysq;
}
