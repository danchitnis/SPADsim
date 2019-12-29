/**
 * 
 * Danial Chitnis
 */

 export class ArrayMaths {
    array: Float32Array;
    len: number;

    constructor(size: number) {
        this.array = new Float32Array(size);
        this.len = size;
    }

    arange(): void {
        for (let i=0; i<this.array.length; i++) {
            this.array[i] = i;
        }
    }

    fill(n: number): void {
        this.array.fill(n);
    }

    log(): void {
        for (let i=0; i<this.array.length; i++) {
            this.array[i] = Math.log(this.array[i]);
        }
    }

    log10(): void {
        for (let i=0; i<this.array.length; i++) {
            this.array[i] = Math.log10(this.array[i]);
        }
    }

    multiply(n: number): void {
        for (let i=0; i<this.array.length; i++) {
            this.array[i] = this.array[i] * n;
        }
    }

    random(): void {
        for (let i=0; i<this.array.length; i++) {
            this.array[i] = Math.random();
        }
    }

    cumsum(): void {
        for (let i=1; i<this.array.length; i++) {
            this.array[i] = this.array[i] + this.array[i-1];
        }
    }
 }