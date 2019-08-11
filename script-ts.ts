import * as nj from "numjs";
import * as noUiSlider from "nouislider";
import { GR } from "grframework";

import { SPAD } from "./SPAD/spad";


let N = 1000;
let phrate = 10;
let tr = 0.02;
let vth = 0.5;

let t = nj.arange(N);

let play = true;

let flag_vth = false;
let flag_new = true;
let flag_CH1 = true;
let flag_CH2 = false;

let run_single = false;

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



//gr.polyline(1000, tplot, yplot);

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





let spad = new SPAD(1000);
let tplot = spad.t.tolist();

setInterval(function() {

  if (run_single) {
    update(false, true, true);
    run_single = false;
  }
  else {
    if (play) {
      update(true, true, true);
    }
  }

}, 100);
  

  
//button function
function ctrl_run():void {
  play = true;
  (<HTMLButtonElement>document.getElementById("bt-run")).style.backgroundColor = "green";
  (<HTMLButtonElement>document.getElementById("bt-single")).style.backgroundColor = "";
}

function ctrl_single():void {
  play = false;
  update(true, true, true);


  (<HTMLButtonElement>document.getElementById("bt-run")).style.backgroundColor = "green";
  (<HTMLButtonElement>document.getElementById("bt-single")).style.backgroundColor = "";
  setTimeout(function() {
    (<HTMLButtonElement>document.getElementById("bt-run")).style.backgroundColor = "";
    (<HTMLButtonElement>document.getElementById("bt-single")).style.backgroundColor = "red";
  }, 200);
  
  
}




slider_tr.noUiSlider.on("update", function(values, handle) {
  tr = parseFloat(values[handle]) / 10;
  (<HTMLParagraphElement>document.getElementById("display_tr")).innerHTML = tr.toString();
  run_single = true;
});

slider_phrate.noUiSlider.on("update", function(values, handle) {
  phrate = parseFloat(values[handle]);
  (<HTMLParagraphElement>document.getElementById("display_phrate")).innerHTML = phrate.toString();
  spad.generate_photon(phrate);
  run_single = true;
});

slider_vth.noUiSlider.on("update", function(values, handle) {
  vth = parseFloat(values[handle]);
  (<HTMLParagraphElement>document.getElementById("display_vth")).innerHTML = vth.toString();
});

slider_vth.noUiSlider.on("start", function(values, handle) {
  //flag_vth = true;
  //flag_new = false;
  //play = true;
  if (!play) {
    setInterval(function() {
        update(false, false, true);
      }, 100);
  }
});
 

slider_vth.noUiSlider.on("end", function(values, handle) {
  //flag_vth = false;
  //flag_new = true;
});



//plot new set

function update(new_photon:boolean, ch1:boolean, ch2:boolean): void {
  if (new_photon) {
    spad.generate_photon(phrate);
  }

  gr.clearws();
  
  if (ch1) {
    spad.update_y(tr);
  }

  if (flag_CH1) {
    gr.setlinecolorind(430);
    gr.polyline(1000, tplot, spad.y.tolist());
  }


  if (ch2) {
    spad.update_ysq(vth);
  }
  if (flag_CH2) {
    gr.setlinecolorind(530);
    gr.polyline(1000, tplot, spad.ysq.tolist());
  }

  
}




// CH functions

function btCH1() {
  let bt = <HTMLButtonElement>document.getElementById("btCH1");
  if (flag_CH1) {
    flag_CH1 = false;
    bt.style.backgroundColor = "";
  } else {
    flag_CH1 = true;
    bt.style.backgroundColor = "Yellow";
  }
}

function btCH2() {
  let bt = <HTMLButtonElement>document.getElementById("btCH2");
  if (flag_CH2) {
    flag_CH2 = false;
    slider_vth.setAttribute("disabled", "true");
    bt.style.backgroundColor = "";
  } else {
    flag_CH2 = true;
    slider_vth.removeAttribute("disabled");
    bt.style.backgroundColor = "lightgreen";
  }
}