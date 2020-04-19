import Snap from 'snapsvg';
import { UndirectedGraph } from '../graph/UndirectedGraph';
import { Block } from './block';

const STROKE_WIDTH = 1;
const BLOCK_SIZE = 40;
const WEIGHT = 3;
const DIAGONAL_WEIGHT = 2;

/**
 * Display SVG blocks using snap
 */
export class Field {
    strokeWidth = STROKE_WIDTH;
    blockSize = BLOCK_SIZE;
    allowDiagonals = false;
    onBlockClick: (event: MouseEvent) => void;
    private paper: Snap.Paper;
    private height: number;
    private width: number;
    private blocks: Map<string, Snap.Element> = new Map<string, Snap.Element>();
    private polyLine: Snap.Element;

    /**
     * Default constructor
     * @param {SVGAElement} svgElement SVG element
     */
    constructor(private svgElement: SVGElement, private graph: UndirectedGraph<Block>) {
        this.svgElement = svgElement;
        this.paper = Snap(svgElement);
        this.height = Number(this.svgElement.clientHeight);
        this.width = Number(this.svgElement.clientWidth);
        console.log(this.height);
        console.log(this.width);
    }

    grid(backgroundColor = 'white', borderColor = 'black') {
        const maxWidth = Math.floor(this.width / this.blockSize);
        const maxHeight = Math.floor(this.height / this.blockSize);
        for (let y = 0; y < maxHeight; y++) {
            for (let x = 0; x < maxWidth; x++) {
                this.addBlock(x, y, backgroundColor, borderColor);
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
        rect.click(this.blockClick.bind(this, key));
        this.blocks.set(key, rect);
    }

    setBlock(x: number, y: number, backgroundColor: string, borderColor: string) {
        const key = this.getKey(x, y);
        this.setBlockByKey(key, backgroundColor, borderColor);
    }

    setBlockByKey(key: string, backgroundColor: string, borderColor: string) {
        const block = this.blocks.get(key);
        if (block) {
            block.attr({
                fill: backgroundColor,
                stroke: borderColor,
            });
        }
    }

    showConnections(blocks: string[]) {
        if (this.polyLine) {
            this.polyLine.remove();
        }
        const points = [];
        for (const blockKey of blocks) {
            const block = this.blocks.get(blockKey);
            const realX = Number(block.node['x'].baseVal.value) + (this.blockSize / 2);
            const realY = Number(block.node['y'].baseVal.value) + (this.blockSize / 2);
            points.push(realX, realY);
        }
        this.polyLine = this.paper.polyline(points);
        this.polyLine.attr({
            fill: 'none',
            stroke: 'green'
        });
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
        this.graph.set(parentKey, { x, y });
        if (x < maxWidth) {
            const key = this.getKey(x + 1, y);
            this.graph.set(key, { x: x + 1, y });
            this.graph.connect(parentKey, key, WEIGHT);
        }
        if (y < maxHeight) {
            const key = this.getKey(x, y + 1);
            this.graph.set(key, { x, y: y + 1 });
            this.graph.connect(parentKey, key, WEIGHT);
        }
        if (this.allowDiagonals) {
            if (x < maxWidth && y < maxHeight) {
                const key = this.getKey(x + 1, y + 1);
                this.graph.set(key, { x: x + 1, y: y + 1 });
                this.graph.connect(parentKey, key, DIAGONAL_WEIGHT);
            }
            if (x > 0 && y < maxHeight) {
                const key = this.getKey(x - 1, y + 1);
                this.graph.set(key, { x: x - 1, y: y + 1 });
                this.graph.connect(parentKey, key, DIAGONAL_WEIGHT);
            }
        }
    }

    private getKey(x: number, y: number) {
        return `${x}_${y}`;
    }

    private blockClick(key: string, event: MouseEvent) {
        console.log(event.toElement);
        this.onBlockClick?.call(null, event);
    }
}
