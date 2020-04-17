import { Block } from './block';

/**
 * Display blocks in a Canvas
 */
export class Drawer {
  canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
    /**
     * Default constructor
     * @param {Canvas} canvas Canvas element
     */
    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
    }
  
    /**
     * Display a block
     * @param {Block} block Block to display
     */
    draw(block: Block) {
      const realX = block.x * block.blockSize, realY = block.y * block.blockSize;
      this.ctx.strokeStyle = block.borderColor;
      this.ctx.strokeRect(realX, realY, block.blockSize, block.blockSize);
      this.ctx.fillStyle = block.backgroundColor;
      this.ctx.fillRect(realX, realY, block.blockSize, block.blockSize);
    }
  
    /**
     * Clear the canvas
     */
    reset() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }