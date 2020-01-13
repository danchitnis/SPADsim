import { ColorRGBA, WebglLine, WebGLplot } from "webgl-plot";
import * as noUiSlider from "nouislider";
import { SPAD } from "./spad";
{
    //const N = 1000;
    let N;
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
    let sliderTr;
    let sliderPhrate;
    let sliderVth;
    let displayTr;
    let displayPhrate;
    let displayVth;
    let btRun;
    let btSingle;
    let btCH1;
    let btCH2;
    let canv;
    const scaleY = 0.9;
    const fpsDivder = 6;
    let fpsCounter = 0;
    let wglp;
    let lineY;
    let lineYsq;
    let lineVth;
    initUI();
    init();
    updateUI();
    const spad = new SPAD(N);
    function newFrame() {
        if (fpsCounter == 0) {
            update(updateNewPh, updateCH1, updateCH2);
            wglp.lines.forEach(line => {
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
    sliderTr.noUiSlider.on("update", function (values, handle) {
        tr = parseFloat(values[handle]) / 10;
        displayTr.innerHTML = tr.toString();
        //run_single = true;
    });
    sliderPhrate.noUiSlider.on("update", function (values, handle) {
        phrate = parseFloat(values[handle]);
        displayPhrate.innerHTML = phrate.toString();
        spad.generatePhoton(phrate);
        //run_single = true;
    });
    sliderVth.noUiSlider.on("update", function (values, handle) {
        vth = parseFloat(values[handle]);
        displayVth.innerHTML = vth.toString();
    });
    sliderTr.noUiSlider.on("start", function (values, handle) { sliderStart(); });
    sliderTr.noUiSlider.on("end", function (values, handle) { sliderEnd(); });
    sliderPhrate.noUiSlider.on("start", function (values, handle) { sliderStart(); });
    sliderPhrate.noUiSlider.on("end", function (values, handle) { sliderEnd(); });
    sliderVth.noUiSlider.on("start", function (values, handle) {
        flagVth = true;
        if (runSingle) {
            updateCH1 = false;
            updateCH2 = true;
        }
    });
    sliderVth.noUiSlider.on("end", function (values, handle) {
        flagVth = false;
        sliderEnd();
    });
    function sliderStart() {
        updateCH1 = true;
        updateCH2 = true;
    }
    function sliderEnd() {
        if (runSingle) {
            updateCH1 = false;
            updateCH2 = false;
        }
    }
    //plot new set
    function update(newPhoton, ch1, ch2) {
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
            }
            else {
                lineVth.visible = false;
            }
        }
    }
    function updateUI() {
        if (updateNewPh) {
            btRun.style.backgroundColor = "green";
        }
        else {
            btRun.style.backgroundColor = "";
        }
        if (flagCH1) {
            btCH1.style.backgroundColor = "yellow";
        }
        else {
            btCH1.style.backgroundColor = "";
        }
        if (flagCH2) {
            btCH2.style.backgroundColor = "green";
        }
        else {
            btCH2.style.backgroundColor = "";
        }
    }
    //button function
    function ctrlRun() {
        runSingle = false;
        updateNewPh = true;
        updateCH1 = true;
        updateCH2 = true;
        btRun.style.backgroundColor = "green";
        btSingle.style.backgroundColor = "";
    }
    function ctrlSingle() {
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
    function btCH1Click() {
        const bt = document.getElementById("btCH1");
        if (flagCH1) {
            flagCH1 = false;
            bt.style.backgroundColor = "";
            lineY.visible = false;
        }
        else {
            flagCH1 = true;
            bt.style.backgroundColor = "Yellow";
            lineY.visible = true;
        }
    }
    function btCH2Click() {
        const bt = document.getElementById("btCH2");
        if (flagCH2) {
            flagCH2 = false;
            sliderVth.setAttribute("disabled", "true");
            bt.style.backgroundColor = "";
            lineYsq.visible = false;
        }
        else {
            flagCH2 = true;
            sliderVth.removeAttribute("disabled");
            bt.style.backgroundColor = "lightgreen";
            lineYsq.visible = true;
        }
    }
    function viewJoin() {
        lineY.offsetY = 0;
        lineY.scaleY = 1;
        lineYsq.offsetY = 0;
        lineYsq.scaleY = 1;
        lineVth.offsetY = 0;
        lineVth.scaleY = 1;
    }
    function viewSplit() {
        lineY.offsetY = 0.5;
        lineY.scaleY = 0.5;
        lineYsq.offsetY = -0.5;
        lineYsq.scaleY = 0.5;
        lineVth.offsetY = 0.5;
        lineVth.scaleY = 0.5;
    }
    function init() {
        const devicePixelRatio = window.devicePixelRatio || 1;
        N = Math.round(canv.clientWidth * devicePixelRatio);
        wglp = new WebGLplot(canv, new ColorRGBA(0.1, 0.1, 0.1, 1));
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
    function initUI() {
        canv = document.getElementById("display");
        sliderTr = document.getElementById('slider_tr');
        sliderPhrate = document.getElementById("slider_phrate");
        sliderVth = document.getElementById("slider_vth");
        displayTr = document.getElementById("displayTr");
        displayPhrate = document.getElementById("displayPhrate");
        displayVth = document.getElementById("displayVth");
        noUiSlider.create(sliderTr, {
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
        });
        btRun = document.getElementById("bt-run");
        btSingle = document.getElementById("bt-single");
        btCH1 = document.getElementById("btCH1");
        btCH2 = document.getElementById("btCH2");
        btRun.addEventListener("click", ctrlRun);
        btSingle.addEventListener("click", ctrlSingle);
        btCH1.addEventListener("click", btCH1Click);
        btCH2.addEventListener("click", btCH2Click);
        let btViewJoin = document.getElementById("btViewJoin");
        let btViewSplit = document.getElementById("btViewSplit");
        btViewJoin.addEventListener("click", viewJoin);
        btViewSplit.addEventListener("click", viewSplit);
    }
}
//# sourceMappingURL=main.js.map