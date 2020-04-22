import Snap from "snapsvg";
import { Block } from "./block";
import { UndirectedGraph } from "../graph/undirectedGraph";

/**
 * Visual representation of the 2 main nodes and the link between them
 */
export class VisualConnection {
    blockSize = 30;
    onDragFinished: () => void;
    private paper: Snap.Paper;
    private startNode: Snap.Element = null;
    private endNode: Snap.Element = null;
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

    setStartNode(x: number, y: number, backgroundColor: string, borderColor: string, borderWidth = 1) {
        if (!this.startNode) {
            this.startNode = this.paper.rect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
            this.startNode.drag(this.onDrag.bind(this, this.startNode), null, this.onDragEnd.bind(this, this.startNode));
            this.startNode.touchmove(this.onTouchMove.bind(this, this.startNode));
            this.startNode.touchend(this.onDragEnd.bind(this, this.startNode));
        }
        this.setNode(this.startNode, x * this.blockSize, y * this.blockSize, backgroundColor, borderColor, borderWidth);
    }

    setEndNode(x: number, y: number, backgroundColor: string, borderColor: string, borderWidth = 1) {
        if (!this.endNode) {
            this.endNode = this.paper.rect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
            this.endNode.drag(this.onDrag.bind(this, this.endNode), null, this.onDragEnd.bind(this, this.endNode));
            this.endNode.touchmove(this.onTouchMove.bind(this, this.endNode));
            this.endNode.touchend(this.onDragEnd.bind(this, this.endNode));
        }
        this.setNode(this.endNode, x * this.blockSize, y * this.blockSize, backgroundColor, borderColor, borderWidth);
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

    getPositionX(element: Snap.Element): number {
        return Math.round(Number(element.attr('x')) / this.blockSize);
    }

    getPositionY(element: Snap.Element): number {
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
        if (x > 0 && y > 0 && x < (this.svgElement.clientWidth - this.blockSize) && y < (this.svgElement.clientHeight - this.blockSize)) {
            element.attr({x, y});
        }
    }

    private onDragEnd(element: Snap.Element, event: MouseEvent): void {
        element.attr({x: this.getPositionX(element) * this.blockSize, y: this.getPositionY(element) * this.blockSize});
        this.onDragFinished();
    }

    // Mobile Support
    private onTouchMove(element: Snap.Element, event: TouchEvent): void {
        const x = event.touches[0].clientX;
        const y = event.touches[0].clientY;
        this.onDrag.call(this, element, x, y, x, y, event);
    }
}
