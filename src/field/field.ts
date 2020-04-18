import Snap from 'snapsvg';
import { UndirectedGraph } from '../graph/UndirectedGraph';
import { Block } from './block';

const STROKE_WIDTH = 1;
const BLOCK_SIZE = 40;
const WEIGHT = 4;
const DIAGONAL_WEIGHT = 2;

/**
 * Display SVG blocks using snap
 */
export class Field {
    strokeWidth = STROKE_WIDTH;
    blockSize = BLOCK_SIZE;
    allowDiagonals = false;
    private paper: Snap.Paper;
    private height: number;
    private width: number;
    private blocks: Map<string, Snap.Element> = new Map<string, Snap.Element>();

    /**
     * Default constructor
     * @param {SVGAElement} svgElement SVG element
     */
    constructor(private svgElement: SVGElement, private graph: UndirectedGraph<Block>) {
        this.svgElement = svgElement;
        this.paper = Snap(svgElement);
        this.height = Number(this.svgElement.getAttribute('height'));
        this.width = Number(this.svgElement.getAttribute('width'));
    }
 
    grid() {
        const maxWidth = Math.floor(this.width / this.blockSize);
        const maxHeight = Math.floor(this.height / this.blockSize);
        for (let y = 0; y < maxHeight; y++) {
            for (let x = 0; x < maxWidth; x++) {
                this.addBlock(x, y, 'white', 'black');
                this.connectBlock(x, y, maxWidth, maxHeight);
            }
        }
    }

    addBlock(x: number, y: number, backgroundColor: string, borderColor: string) {
        const realX = x * this.blockSize, realY = y * this.blockSize;
        const key = this.getKey(x, y);
        const rect = this.paper.rect(realX, realY, this.blockSize, this.blockSize);
        rect.attr({
            fill: backgroundColor,
            stroke: borderColor,
            strokeWidth: 1
        });
        rect.click(this.blockClick.bind(this, rect));
        this.blocks.set(key, rect);
    }

    setBlock(x: number, y: number, backgroundColor: string, borderColor: string) {
        const block = this.getBlock(x, y);
        if (block) {
            block.attr({
                fill: backgroundColor,
                stroke: borderColor,
            });
        }
    }

    private getBlock(x: number, y: number): Snap.Element {
        const key = this.getKey(x, y);
        return this.blocks.get(key);
    }

    /**
     * Connect Block with its neighbours
     * @param x X
     * @param y Y
     * @param maxWidth Max Width
     * @param maxHeight Max Height
     */
    private connectBlock(x: number, y: number, maxWidth: number, maxHeight: number) {
        const parentKey = this.getKey(x, y);
        this.graph.add(parentKey, { x, y });
        if (x < maxWidth) {
            const key = this.getKey(x + 1, y);
            this.graph.add(key, { x: x + 1, y });
            this.graph.connect(parentKey, key, WEIGHT);
        }
        if (y < maxHeight) {
            const key = this.getKey(x, y + 1);
            this.graph.add(key, { x, y: y + 1 });
            this.graph.connect(parentKey, key, WEIGHT);
        }
        if (this.allowDiagonals && x < maxWidth && y < maxHeight) {
            const key = this.getKey(x + 1, y + 1);
            this.graph.add(key, { x: x + 1, y: y + 1 });
            this.graph.connect(parentKey, key, DIAGONAL_WEIGHT);
        }
    }

    private getKey(x: number, y: number) {
        return `${x}_${y}`;
    }

    private blockClick(element: Snap.Element) {
        // TODO
    }
}