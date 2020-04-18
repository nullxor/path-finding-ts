import Snap from 'snapsvg';

const STROKE_WIDTH = 1;
const BLOCK_SIZE = 40;

/**
 * Display SVG blocks using snap
 */
export class Field {
    strokeWidth = STROKE_WIDTH;
    blockSize = BLOCK_SIZE;
    private paper: Snap.Paper;
    private height: number;
    private width: number;
    private blocks: Map<string, Snap.Element> = new Map<string, Snap.Element>();

    /**
     * Default constructor
     * @param {SVGAElement} svgElement SVG element
     */
    constructor(private svgElement: SVGElement) {
        this.svgElement = svgElement;
        this.paper = Snap(svgElement);
        this.height = Number(this.svgElement.getAttribute('height'));
        this.width = Number(this.svgElement.getAttribute('width'));
    }
 
    grid() {
        for (let y = 0; y < this.height / this.blockSize; y++) {
            for (let x = 0; x < this.width / this.blockSize; x++) {
                this.addBlock(x, y, 'white', 'black');
            }
        }
    }

    private addBlock(x: number, y: number, backgroundColor: string, borderColor: string) {
        const realX = x * this.blockSize, realY = y * this.blockSize;
        const key = `${x}_${y}`;
        const rect = this.paper.rect(realX, realY, this.blockSize, this.blockSize);
        rect.attr({
            fill: backgroundColor,
            stroke: borderColor,
            strokeWidth: 1
        });
        rect.click(this.blockClick.bind(this, rect));
        this.blocks.set(key, rect);
    }

    private getBlock(x: number, y: number): Snap.Element {
        const key = `${x}_${y}`;
        return this.blocks.get(key);
    }

    private blockClick(element: Snap.Element) {
        // TODO
    }
}