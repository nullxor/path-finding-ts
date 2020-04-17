export class Block {
    x: number;
    y: number;
    blockSize: number;
    backgroundColor: string;
    borderColor: string;

    /**
     * Block operations
     * @param {number} x X axis position
     * @param {number} y Y axis position
     * @param {number} blockSize Block size in pixels
     * @param {string} backgroundColor Valid CSS color
     * @param {string} borderColor Valid CSS color
     */
    constructor(x: number, y: number, blockSize=5, backgroundColor='red', borderColor='#000') {
        this.x = x;
        this.y = y;
        this.blockSize = blockSize;
        this.backgroundColor = backgroundColor;
        this.borderColor = borderColor;
    }
}