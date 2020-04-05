import { ColorRGBA, WebglLine, WebGLplot } from "webgl-plot";
import { SimpleSlider } from "@danchitnis/simple-slider";
import { SPAD } from "./spad";

{
  //const N = 1000;
  let N: number;
  let phrate = 10;
  let tr = 0.02;
  let vth = 0.5;

  let flagVth = false;

  let flagCH1 = true;
  let flagCH2 = false;

  let runSingle = false;

  let updateNewPh = true;
  let updateCH1 = true;
  let updateCH2 = true;

  let sliderTr: SimpleSlider;
  let sliderPhrate: SimpleSlider;
  let sliderVth: SimpleSlider;

  let displayTr: HTMLSpanElement;
  let displayPhrate: HTMLSpanElement;
  let displayVth: HTMLSpanElement;

  let btRun: HTMLButtonElement;
  let btSingle: HTMLButtonElement;
  let btCH1: HTMLButtonElement;
  let btCH2: HTMLButtonElement;

  let canv: HTMLCanvasElement;

  const scaleY = 0.9;

  const fpsDivder = 6;
  let fpsCounter = 0;

  let wglp: WebGLplot;

  let lineY: WebglLine;
  let lineYsq: WebglLine;
  let lineVth: WebglLine;

  initUI();
  init();

  updateUI();

  const spad = new SPAD(N);

  function newFrame(): void {
    if (fpsCounter == 0) {
      update(updateNewPh, updateCH1, updateCH2);
      wglp.lines.forEach((line) => {
        //
      });

      wglp.clear();
      wglp.update();

      wglp.gScaleY = scaleY;
    }

    fpsCounter++;

    if (fpsCounter >= fpsDivder) {
      fpsCounter = 0;
    }

    window.requestAnimationFrame(newFrame);
  }

  window.requestAnimationFrame(newFrame);

  sliderTr.addEventListener("update", () => {
    tr = sliderTr.value / 10;
    displayTr.innerHTML = tr.toPrecision(2);
  });

  sliderPhrate.addEventListener("update", () => {
    phrate = sliderPhrate.value;
    displayPhrate.innerHTML = phrate.toPrecision(2);
    spad.generatePhoton(phrate);
  });

  sliderVth.addEventListener("update", () => {
    vth = sliderVth.value;
    displayVth.innerHTML = vth.toPrecision(2);
  });

  sliderTr.addEventListener("drag-start", sliderStart);
  sliderTr.addEventListener("drag-end", sliderEnd);

  sliderPhrate.addEventListener("drag-start", sliderStart);
  sliderPhrate.addEventListener("drag-end", sliderEnd);

  sliderVth.addEventListener("drag-start", () => {
    flagVth = true;
    if (runSingle) {
      updateCH1 = false;
      updateCH2 = true;
    }
  });

  sliderVth.addEventListener("drag-end", () => {
    flagVth = false;
    sliderEnd();
  });

  function sliderStart(): void {
    updateCH1 = true;
    updateCH2 = true;
  }

  function sliderEnd(): void {
    if (runSingle) {
      updateCH1 = false;
      updateCH2 = false;
    }
  }

  //plot new set

  function update(newPhoton: boolean, ch1: boolean, ch2: boolean): void {
    if (newPhoton) {
      spad.generatePhoton(phrate);
    }

    if (ch1) {
      spad.updateY(tr);
    }

    if (flagCH1) {
      for (let i = 0; i < N; i++) {
        lineY.setY(i, 1.9 * spad.y.array[i] - 0.9);
      }
    }

    if (ch2) {
      spad.updateYsq(vth);
    }
    if (flagCH2) {
      for (let i = 0; i < N; i++) {
        lineYsq.setY(i, 1.9 * spad.ysq.array[i] - 0.9);
      }

      if (flagVth) {
        lineVth.visible = true;
        for (let i = 0; i < N; i++) {
          lineVth.constY(1.9 * vth - 0.9);
        }
      } else {
        lineVth.visible = false;
      }
    }
  }

  function updateUI(): void {
    if (updateNewPh) {
      btRun.style.backgroundColor = "green";
    } else {
      btRun.style.backgroundColor = "";
    }

    if (flagCH1) {
      btCH1.style.backgroundColor = "yellow";
    } else {
      btCH1.style.backgroundColor = "";
    }

    if (flagCH2) {
      btCH2.style.backgroundColor = "green";
    } else {
      btCH2.style.backgroundColor = "";
    }
  }

  //button function
  function ctrlRun(): void {
    runSingle = false;
    updateNewPh = true;
    updateCH1 = true;
    updateCH2 = true;
    btRun.style.backgroundColor = "green";
    btSingle.style.backgroundColor = "";
  }

  function ctrlSingle(): void {
    console.log("hello!");

    runSingle = true;
    updateNewPh = false;
    updateCH1 = false;
    updateCH2 = false;
    update(true, true, true);

    btRun.style.backgroundColor = "green";
    btSingle.style.backgroundColor = "";
    setTimeout(() => {
      btRun.style.backgroundColor = "";
      btSingle.style.backgroundColor = "red";
    }, 200);
  }

  // CH functions

  function btCH1Click(): void {
    const bt = document.getElementById("btCH1") as HTMLButtonElement;
    if (flagCH1) {
      flagCH1 = false;
      bt.style.backgroundColor = "";
      lineY.visible = false;
    } else {
      flagCH1 = true;
      bt.style.backgroundColor = "Yellow";
      lineY.visible = true;
    }
  }

  function btCH2Click(): void {
    const bt = document.getElementById("btCH2") as HTMLButtonElement;
    if (flagCH2) {
      flagCH2 = false;
      sliderVth.setEnable(false);
      bt.style.backgroundColor = "";
      lineYsq.visible = false;
    } else {
      flagCH2 = true;
      sliderVth.setEnable(true);
      bt.style.backgroundColor = "lightgreen";
      lineYsq.visible = true;
    }
  }

  function viewJoin(): void {
    lineY.offsetY = 0;
    lineY.scaleY = 1;

    lineYsq.offsetY = 0;
    lineYsq.scaleY = 1;

    lineVth.offsetY = 0;
    lineVth.scaleY = 1;
  }

  function viewSplit(): void {
    lineY.offsetY = 0.5;
    lineY.scaleY = 0.5;

    lineYsq.offsetY = -0.5;
    lineYsq.scaleY = 0.5;

    lineVth.offsetY = 0.5;
    lineVth.scaleY = 0.5;
  }

  function init(): void {
    const devicePixelRatio = window.devicePixelRatio || 1;
    N = Math.round(canv.clientWidth * devicePixelRatio);

    wglp = new WebGLplot(canv);

    wglp.clear();

    const color = new ColorRGBA(0, 1, 1, 1);
    lineY = new WebglLine(color, N);
    lineY.linespaceX(-1, 2 / N);
    lineY.visible = true;
    wglp.addLine(lineY);

    lineYsq = new WebglLine(new ColorRGBA(0, 1, 0, 1), N);
    lineYsq.linespaceX(-1, 2 / N);
    lineYsq.visible = false;
    wglp.addLine(lineYsq);

    lineVth = new WebglLine(new ColorRGBA(1, 1, 0, 1), N);
    lineVth.linespaceX(-1, 2 / N);
    lineVth.visible = false;
    wglp.addLine(lineVth);
  }

  function initUI(): void {
    canv = document.getElementById("display") as HTMLCanvasElement;

    sliderTr = new SimpleSlider("slider_tr", 0.01, 1, 0);
    sliderPhrate = new SimpleSlider("slider_phrate", 0.1, 200, 0);
    sliderVth = new SimpleSlider("slider_vth", 0.01, 1, 0);

    displayTr = document.getElementById("displayTr") as HTMLSpanElement;
    displayPhrate = document.getElementById("displayPhrate") as HTMLSpanElement;
    displayVth = document.getElementById("displayVth") as HTMLSpanElement;

    sliderTr.setValue(0.5);
    sliderPhrate.setValue(10);

    sliderVth.setValue(0.5);
    sliderVth.setEnable(false);

    /*noUiSlider.create(sliderTr, {
      start: [0.5],
      connect: [true, false],
      //tooltips: [false, wNumb({decimals: 1}), true],
      range: {
        min: 0.01,
        max: 1
      }
    });

    noUiSlider.create(sliderPhrate, {
      start: [10],
      connect: [true, false],
      //tooltips: [false, wNumb({decimals: 1}), true],
      range: {
        min: 0.1,
        max: 200
      }
    });

    //slider_vth.style.visibility = "hidden";
    sliderVth.setAttribute("disabled", "true");
    noUiSlider.create(sliderVth, {
      start: [0.5],
      connect: [true, false],
      //tooltips: [false, wNumb({decimals: 1}), true],
      range: {
        min: 0.01,
        max: 1
      }
    });*/

    btRun = document.getElementById("bt-run") as HTMLButtonElement;
    btSingle = document.getElementById("bt-single") as HTMLButtonElement;
    btCH1 = document.getElementById("btCH1") as HTMLButtonElement;
    btCH2 = document.getElementById("btCH2") as HTMLButtonElement;

    btRun.addEventListener("click", ctrlRun);
    btSingle.addEventListener("click", ctrlSingle);
    btCH1.addEventListener("click", btCH1Click);
    btCH2.addEventListener("click", btCH2Click);

    const btViewJoin = document.getElementById("btViewJoin") as HTMLButtonElement;
    const btViewSplit = document.getElementById("btViewSplit") as HTMLButtonElement;

    btViewJoin.addEventListener("click", viewJoin);
    btViewSplit.addEventListener("click", viewSplit);
  }
}
