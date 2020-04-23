import Snap from 'snapsvg';
import { UndirectedGraph } from '../graph/undirectedGraph';
import { Block } from './block';

const BLOCK_SIZE = 30;
const WEIGHT = 1;
const DIAGONAL_WEIGHT = 1.5;
const BACKGROUND_COLOR = '#f1f1f1';
const BORDER_COLOR = '#bbb';
const STROKE_WIDTH = 1;

/**
 * Display SVG blocks using snap
 */
export class BlockField {
    blockSize = BLOCK_SIZE;
    strokeWidth = STROKE_WIDTH;
    allowDiagonals = true;
    private paper: Snap.Paper;
    private height: number;
    private width: number;
    private blocks = new Map<string, Snap.Element>();

    /**
     * Default constructor
     * @param {SVGAElement} svgElement SVG element
     * @param {UndirectedGraph} graph Undirected Graph
     */
    constructor(private svgElement: SVGElement, private graph: UndirectedGraph<Block>) {
        this.svgElement = svgElement;
        this.paper = Snap(svgElement);
        this.height = Number(this.svgElement.clientHeight);
        this.width = Number(this.svgElement.clientWidth);
        this.svgElement.innerHTML = '';
    }

    get maxWidth(): number {
        return Math.floor(this.width / this.blockSize);
    }

    get maxHeight(): number {
        return Math.floor(this.height / this.blockSize);
    }

    grid(backgroundColor = BACKGROUND_COLOR, borderColor = BORDER_COLOR): void {
        for (let y = 0; y < this.maxHeight; y++) {
            for (let x = 0; x < this.maxWidth; x++) {
                this.addBlock(x, y, backgroundColor, borderColor);
                this.connectBlock(x, y, this.maxWidth-1, this.maxHeight-1);
            }
        }
    }

    private addBlock(x: number, y: number, fill: string, stroke: string) {
        const real = Block.toPixel(x, y, this.blockSize);
        const key = this.getKey(x, y);
        const rect = this.paper.rect(real.x, real.y, this.blockSize, this.blockSize);
        rect.attr({fill, stroke, strokeWidth: this.strokeWidth});
        this.blocks.set(key, rect);
    }

    /**
     * Connect block with its neighbours, for this particular case a Block is a Vertex
     * @param x X
     * @param y Y
     * @param maxWidth Max Width
     * @param maxHeight Max Height
     */
    private connectBlock(x: number, y: number, maxWidth: number, maxHeight: number) {
        const parentKey = this.getKey(x, y);
        this.graph.set(parentKey, {x, y});
        if (x < maxWidth) {
            const key = this.getKey(x + 1, y);
            this.graph.set(key, {x: x + 1, y});
            this.graph.connect(parentKey, key, WEIGHT);
        }
        if (y < maxHeight) {
            const key = this.getKey(x, y + 1);
            this.graph.set(key, {x, y: y + 1});
            this.graph.connect(parentKey, key, WEIGHT);
        }
        if (this.allowDiagonals) {
            if (x < maxWidth && y < maxHeight) {
                const key = this.getKey(x + 1, y + 1);
                this.graph.set(key, {x: x + 1, y: y + 1});
                this.graph.connect(parentKey, key, DIAGONAL_WEIGHT, true);
            }
            if (x > 0 && y < maxHeight) {
                const key = this.getKey(x - 1, y + 1);
                this.graph.set(key, {x: x - 1, y: y + 1});
                this.graph.connect(parentKey, key, DIAGONAL_WEIGHT, true);
            }
        }
    }

    private getKey(x: number, y: number) {
        return `${x}_${y}`;
    }
}
