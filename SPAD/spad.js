"use strict";
//SPAD object
//by Danial Chitnis
//29/07/2019

var SPAD = /** @class */ (function () {
    function SPAD(tr) {
        this.tr = tr;
        this.t = nj.arange(1000);
        this.y = nj.zeros(1000);
    }
    SPAD.prototype.generate = function () {
        this.y = (nj.arange(1000)).divide(1000);
        return this.y;
    };
    return SPAD;
}());

