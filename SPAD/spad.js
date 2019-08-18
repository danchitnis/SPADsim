"use strict";
//SPAD object
//by Danial Chitnis
//29/07/2019
/**
 * SPAD CLass function
 */
var SPAD = /** @class */ (function () {
    /**
     *
     * @param N the number of datapoints in time
     */
    function SPAD(N) {
        this.N = N;
        this.t = nj.arange(N);
        this.tr = 0;
        this.timestamps = nj.arange(N);
        this.y = nj.zeros(N);
        this.ysq = nj.zeros(N);
        this.bw = 0;
    }
    /**
     * SPAD photon gneration based random numbers
     * @param phrate photon rate normlised to 1
     */
    SPAD.prototype.generate_photon = function (phrate) {
        var u = nj.random(phrate * 3);
        //let tgap=-(1/phrate)*nj.log(u)*T;
        var tgap = (nj.log(u)).multiply(-1 / phrate);
        this.timestamps = cumsum(tgap);
    };
    /**
     * generate the y values based on the recovery time.
     * run generate photon first
     * @param tr the recovery time
     */
    SPAD.prototype.update_y = function (tr) {
        this.tr = tr;
        var ystep = this.tr;
        var index = 0;
        var y = nj.zeros(this.N);
        var tstep = 1 / this.N;
        for (var i = 2; i < this.t.shape[0]; i++) {
            if (i * tstep > this.timestamps.get(index)) {
                var u = nj.random(1).get(0);
                if (u > y.get(i - 1)) {
                    y.set(i, 1);
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
        this.y = y;
    };
    /**
     * Do the square inverter thresholding
     * @param vthr the voltage threshold value from 0 to 1 range
     */
    SPAD.prototype.update_ysq = function (vthr) {
        var ysq = nj.zeros(this.N);
        for (var i = 0; i < this.y.shape[0]; i++) {
            if (this.y.get(i) < vthr) {
                ysq.set(i, 0);
            }
            else {
                ysq.set(i, 1);
            }
        }
        if (this.bw > 0) {
            apply_bw(ysq, this.bw);
        }
        this.ysq = ysq;
    };
    return SPAD;
}());
function apply_ystep(y, i, ystep) {
    if (y.get(i - 1) > 0) {
        var a = y.get(i - 1) - ystep;
        y.set(i, a);
    }
    else {
        y.set(i, 0);
    }
}
function cumsum(array) {
    var size = array.shape[0];
    var sum = nj.zeros(size);
    sum.set(0, array.get(0));
    for (var i = 1; i < size; i++) {
        var a = sum.get(i - 1) + array.get(i);
        sum.set(i, a);
    }
    return sum;
}
function apply_bw(y, bw) {
    //
}
