import Snap from "snapsvg";
import { Block } from "./block";
import { UndirectedGraph } from "../graph/undirectedGraph";

const START_BACKGROUND_COLOR = 'rgba(41, 128, 185, 0.5)';
const START_BORDER_COLOR = 'black';
const END_BACKGROUND_COLOR = 'rgba(39, 174, 96, 0.5)';
const END_BORDER_COLOR = 'black';

/**
 * Visual representation of the 2 main nodes and the link between them
 */
export class VisualConnection {
    blockSize = 30;
    onDragFinished: () => void;
    private paper: Snap.Paper;
    private startNode: Snap.Element = null;
    private endNode: Snap.Element = null;
    private wire: Snap.Element = null;
    private polyLine: Snap.Element;

    /**
     * Default constructor
     * @param {SVGAElement} svgElement SVG element
     * @param {UndirectedGraph} graph Undirected Graph
     */
    constructor(private svgElement: SVGElement, private graph: UndirectedGraph<Block>) {
        this.svgElement = svgElement;
        this.paper = Snap(svgElement);
    }
    
    setStartNode(x: number, y: number) {
        if (!this.startNode) {
            this.startNode = this.paper.rect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
            this.startNode.drag(this.onDrag.bind(this, this.wire), null, this.onDragEnd.bind(this, this.startNode));
            this.startNode.touchmove(this.onTouchMove.bind(this, this.startNode));
            this.startNode.touchend(this.onDragEnd.bind(this, this.startNode));
        }
        this.setNode(this.startNode, x * this.blockSize, y * this.blockSize, START_BACKGROUND_COLOR, START_BORDER_COLOR, 1);
    }

    setEndNode(x: number, y: number) {
        if (!this.endNode) {
            this.endNode = this.paper.rect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
            this.endNode.drag(this.onDrag.bind(this, this.wire), null, this.onDragEnd.bind(this, this.endNode));
            this.endNode.touchmove(this.onTouchMove.bind(this, this.endNode));
            this.endNode.touchend(this.onDragEnd.bind(this, this.endNode));
        }
        this.setNode(this.endNode, x * this.blockSize, y * this.blockSize, END_BACKGROUND_COLOR, END_BORDER_COLOR, 1);
    }

    showConnections(blocks: string[], totalWeight: number) {
        if (this.polyLine) {
            this.polyLine.remove();
        }
        const points = [];
        for (const blockKey of blocks) {
            const vertex = this.graph.get(blockKey);
            const coord = Block.toPixel(vertex, this.blockSize);
            const realX = coord.x + this.blockSize / 2 ;
            const realY = coord.y + this.blockSize / 2 ;
            points.push(realX, realY);
        }
        const info = `Block(s): ${blocks.length - 1} - Weight: ${totalWeight}`;
        const infoDiv = document.getElementById('information');
        infoDiv.innerHTML = info;

        this.polyLine = this.paper.polyline(points);
        this.polyLine.attr({
            fill: 'none',
            stroke: '#333',
            strokeWidth: 2,
            'font-size': '10px'
        });
    }

    get startX(): number {
        return this.getPositionX(this.startNode);
    }

    get endX(): number {
        return this.getPositionX(this.endNode);
    }

    get startY(): number {
        return this.getPositionY(this.startNode);
    }

    get endY(): number {
        return this.getPositionY(this.endNode);
    }

    /**
     * X Position in "Block" unit
     * @param element Snap Element
     */
    private getPositionX(element: Snap.Element): number {
        return Math.round(Number(element.attr('x')) / this.blockSize);
    }

    /**
     * Y Position in "Block" unit
     * @param element Snap Element
     */
    private getPositionY(element: Snap.Element): number {
        return Math.round(Number(element.attr('y')) / this.blockSize);
    }
    
    private setNode(element: Snap.Element, x: number, y: number, backgroundColor: string, borderColor: string, borderWidth = 1) {
        element.attr({
            x: x,
            y: y,
            fill: backgroundColor,
            stroke: borderColor,
            strokeWidth: borderWidth
        });
    }

    private onDrag(element: Snap.Element, dx: number, dy: number, x: number, y: number, event: MouseEvent): void {
        if (!this.wire) {
            this.wire = this.paper.rect(0, 0, this.blockSize, this.blockSize);
            this.wire.attr({fill:'transparent', stroke:'black' });
        }
        if (x > 0 && y > 0 && x < (this.svgElement.clientWidth - this.blockSize) && y < (this.svgElement.clientHeight - this.blockSize)) {
            this.wire.attr({x, y});
        }
    }

    private onDragEnd(element: Snap.Element, event: MouseEvent): void {
        const pos = Block.toBlock({x: event.x, y: event.y}, this.blockSize);
        const block = this.graph.getVertex(`${pos.x}_${pos.y}`);
        if (!block.isObstacle) {
            element.attr({x: pos.x * this.blockSize, y: pos.y * this.blockSize});
        }
        this.onDragFinished();
        this.wire.remove();
        this.wire = null;
    }

    // Mobile Support
    private onTouchMove(element: Snap.Element, event: TouchEvent): void {
        const x = event.touches[0].clientX;
        const y = event.touches[0].clientY;
        this.onDrag.call(this, element, x, y, x, y, event);
    }
}
