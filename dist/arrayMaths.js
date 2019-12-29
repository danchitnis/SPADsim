/**
 *
 * Danial Chitnis
 */
export class ArrayMaths {
    constructor(size) {
        this.array = new Float32Array(size);
        this.len = size;
    }
    arange() {
        for (let i = 0; i < this.array.length; i++) {
            this.array[i] = i;
        }
    }
    fill(n) {
        this.array.fill(n);
    }
    log() {
        for (let i = 0; i < this.array.length; i++) {
            this.array[i] = Math.log(this.array[i]);
        }
    }
    log10() {
        for (let i = 0; i < this.array.length; i++) {
            this.array[i] = Math.log10(this.array[i]);
        }
    }
    multiply(n) {
        for (let i = 0; i < this.array.length; i++) {
            this.array[i] = this.array[i] * n;
        }
    }
    random() {
        for (let i = 0; i < this.array.length; i++) {
            this.array[i] = Math.random();
        }
    }
    cumsum() {
        for (let i = 1; i < this.array.length; i++) {
            this.array[i] = this.array[i] + this.array[i - 1];
        }
    }
}
//# sourceMappingURL=arrayMaths.js.map