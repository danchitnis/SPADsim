"use strict";
/**
 * Author Danial Chitnis 2019
 *
 * inspired by:
 * https://codepen.io/AzazelN28
 * https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm
 */
exports.__esModule = true;
var color_rgba = /** @class */ (function () {
    function color_rgba(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    return color_rgba;
}());
exports.color_rgba = color_rgba;
var lineGroup = /** @class */ (function () {
    function lineGroup(c, xy) {
        this.color = c;
        this.num_points = xy.shape[0];
        this.xy = xy;
        this.vbuffer = 0;
        this.prog = 0;
    }
    return lineGroup;
}());
exports.lineGroup = lineGroup;
var webGLplot = /** @class */ (function () {
    /**
     *
     * @param canv
     * @param array
     */
    function webGLplot(canv) {
        var devicePixelRatio = window.devicePixelRatio || 1;
        // set the size of the drawingBuffer based on the size it's displayed.
        canv.width = canv.clientWidth * devicePixelRatio;
        canv.height = canv.clientHeight * devicePixelRatio;
        var gl = canv.getContext("webgl", {
            antialias: true,
            transparent: false
        });
        this.linegroups = [];
        this.gl = gl;
        this.scaleX = 1;
        this.scaleY = 1;
        // Clear the canvas  //??????????????????
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        // Enable the depth test
        gl.enable(gl.DEPTH_TEST);
        // Clear the color and depth buffer
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Set the view port
        gl.viewport(0, 0, canv.width, canv.height);
    }
    /**
    * update
    */
    webGLplot.prototype.update = function () {
        var _this = this;
        var gl = this.gl;
        this.linegroups.forEach(function (lg) {
            gl.useProgram(lg.prog);
            var uscale = gl.getUniformLocation(lg.prog, 'uscale');
            gl.uniformMatrix2fv(uscale, false, new Float32Array([_this.scaleX, 0, 0, _this.scaleY]));
            gl.bufferData(gl.ARRAY_BUFFER, lg.xy.data, gl.STREAM_DRAW);
            gl.drawArrays(gl.LINE_STRIP, 0, lg.num_points);
        });
    };
    webGLplot.prototype.add_line = function (line) {
        line.num_points = line.xy.shape[0];
        line.vbuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, line.vbuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, line.xy.data, this.gl.STREAM_DRAW);
        var vertCode = "\n      attribute vec2 coordinates;\n      uniform mat2 uscale;\n      void main(void) {\n         gl_Position = vec4(uscale*coordinates, 0.0, 1.0);\n      }";
        // Create a vertex shader object
        var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        // Attach vertex shader source code
        this.gl.shaderSource(vertShader, vertCode);
        // Compile the vertex shader
        this.gl.compileShader(vertShader);
        // Fragment shader source code
        var fragCode = "\n         void main(void) {\n            gl_FragColor = vec4(" + line.color.r + ", " + line.color.g + ", " + line.color.b + ", " + line.color.a + ");\n         }";
        var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fragShader, fragCode);
        this.gl.compileShader(fragShader);
        line.prog = this.gl.createProgram();
        this.gl.attachShader(line.prog, vertShader);
        this.gl.attachShader(line.prog, fragShader);
        this.gl.linkProgram(line.prog);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, line.vbuffer);
        var coord = this.gl.getAttribLocation(line.prog, "coordinates");
        this.gl.vertexAttribPointer(coord, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(coord);
        this.linegroups.push(line);
    };
    return webGLplot;
}());
exports.webGLplot = webGLplot;
