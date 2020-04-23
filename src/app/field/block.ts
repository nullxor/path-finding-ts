import { Coord } from "./coord";

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

    /**
     * Converts from "Block Unit" to pixel
     */
    static toPixel(block: Block, blockSize: number): Coord {
        return { x: block.x * blockSize, y: block.y * blockSize };
    }

    /**
     * Converts from pixel to "Block Unit"
     */
    static toBlock(block: Block, blockSize: number): Coord {
        return { x: Math.floor(block.x / blockSize), y: Math.floor(block.y / blockSize) };
    }
}