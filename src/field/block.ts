export class Block {
    x: number;
    y: number;

    /**
     * Block operations
     * @param {number} x X axis position
     * @param {number} y Y axis position
     * @param {number} blockSize Block size in pixels
     * @param {string} backgroundColor Valid CSS color
     * @param {string} borderColor Valid CSS color
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}