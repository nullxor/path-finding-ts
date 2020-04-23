import Snap from "snapsvg";
import { Block } from "./block";
import { UndirectedGraph } from "../graph/undirectedGraph";

const START_BACKGROUND_COLOR = 'rgba(41, 128, 185, 0.5)';
const START_BORDER_COLOR = 'black';
const END_BACKGROUND_COLOR = 'rgba(39, 174, 96, 0.5)';
const END_BORDER_COLOR = 'black';
const OBSTACLE_BACKGROUND_COLOR = 'gray';
const BACKGROUND_COLOR = '#f1f1f1';
const BLOCK_SIZE = 30;

/**
 * Visual representation of the 2 main nodes and the link between them
 */
export class VisualConnection {
    blockSize = BLOCK_SIZE;
    onDragFinished: () => void;
    onObstacleFinished: () => void;
    private paper: Snap.Paper;
    private startNode: Snap.Element = null;
    private endNode: Snap.Element = null;
    private draggingNode: Snap.Element = null;
    private wire: Snap.Element = null;
    private polyLine: Snap.Element;
    private isObstacleMode = false;

    /**
     * Default constructor
     * @param {SVGAElement} svgElement SVG element
     * @param {UndirectedGraph} graph Undirected Graph
     */
    constructor(private svgElement: SVGElement, private graph: UndirectedGraph<Block>) {
        this.svgElement = svgElement;
        this.paper = Snap(svgElement);
        this.graph = graph;
        this.paper.drag(this.onDrag.bind(this), this.onDragStart.bind(this), this.onDragEnd.bind(this));
        this.paper.touchstart(this.onTouchStart.bind(this));
        this.paper.touchmove(this.onTouchMove.bind(this));
        this.paper.touchend(this.onTouchEnd.bind(this));
    }
    
    setStartNode(x: number, y: number) {
        if (!this.startNode) {
            this.startNode = this.paper.rect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
        }
        this.setNode(this.startNode, x * this.blockSize, y * this.blockSize, START_BACKGROUND_COLOR, START_BORDER_COLOR, 1);
    }

    setEndNode(x: number, y: number) {
        if (!this.endNode) {
            this.endNode = this.paper.rect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
        }
        this.setNode(this.endNode, x * this.blockSize, y * this.blockSize, END_BACKGROUND_COLOR, END_BORDER_COLOR, 1);
    }

    showConnections(blocks: string[], totalWeight: number) {
        const infoDiv = document.getElementById('information');
        this.polyLine?.remove();
        if(totalWeight === -1) {
            infoDiv.innerHTML = "Can't reach the destination node :-S";
            return;
        }
        const points = [];
        for (const blockKey of blocks) {
            const vertex = this.graph.get(blockKey);
            const coord = Block.toPixel(vertex.x, vertex.y, this.blockSize);
            const realX = coord.x + this.blockSize / 2 ;
            const realY = coord.y + this.blockSize / 2 ;
            points.push(realX, realY);
        }
        const info = `Block(s): ${blocks.length - 1} - Weight: ${totalWeight}`;
        infoDiv.innerHTML = info;
        this.polyLine = this.paper.polyline(points);
        this.polyLine.attr({fill: 'none', stroke: '#333', strokeWidth: 2});
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
        element.attr({x, y, fill: backgroundColor, stroke: borderColor, strokeWidth: borderWidth});
    }

    private onDragStart(x: number, y: number, event: MouseEvent) {
        const element = Snap.getElementByPoint(x, y);
        if (element === this.startNode || element=== this.endNode) {
            this.onNodeDragStart(element, x, y, event);
        } else {
            this.onPaperDragStart(element, x, y, event);
        }
    }

    private onDrag(dx: number, dy: number, x: number, y: number, event: MouseEvent): void {
        const element = Snap.getElementByPoint(x, y);
        if (this.draggingNode) {
            this.onNodeDrag(element, dx, dy, x, y, event);
        } else {
            this.onPaperDrag(element, dx, dy, x, y, event);
        }
    }

    private onDragEnd(event: MouseEvent): void {
        const element = Snap.getElementByPoint(event.x, event.y);
        if (this.draggingNode) {
            this.onNodeDragEnd(element, event);
        } else {
            this.onPaperDragEnd(event);
        }
    }

    private onNodeDragStart(element: Snap.Element, x: number, y: number, event: MouseEvent) {
        this.draggingNode = element;
        if (!this.wire) {
            this.wire = this.paper.rect(Number(element.attr('x')), Number(element.attr('y')), this.blockSize, this.blockSize);
            this.wire.attr({fill:'transparent', stroke:'black' });
        }
    }

    private onNodeDrag(element: Snap.Element, dx: number, dy: number, x: number, y: number, event: MouseEvent): void {
        if (x > 0 && y > 0 && x < (this.svgElement.clientWidth - this.blockSize) && y < (this.svgElement.clientHeight - this.blockSize)) {
            this.wire.attr({x, y});
        }
    }

    private onNodeDragEnd(element: Snap.Element, event: MouseEvent) {
        const pos = Block.toBlock(Number(this.wire.attr('x')), Number(this.wire.attr('y')), this.blockSize);
        const block = this.graph.getVertex(Block.getKey(pos.x, pos.y));
        if (!block.isObstacle) {
            this.draggingNode.attr({x: pos.x * this.blockSize, y: pos.y * this.blockSize});
        }
        this.wire.remove();
        this.wire = null;
        this.draggingNode = null;
        this.onDragFinished();
    }

    private onPaperDragStart(element: Snap.Element, x: number, y: number, event: MouseEvent) {
        const pos = Block.toBlock(x, y, this.blockSize);
        const vertex = this.graph.getVertex(Block.getKey(pos.x, pos.y));
        this.isObstacleMode = !vertex.isObstacle;
    }

    private onPaperDrag(element: Snap.Element, dx: number, dy: number, x: number, y: number, event: MouseEvent): void {
        const pos = Block.toBlock(x, y, this.blockSize);
        const vertex = this.graph.getVertex(Block.getKey(pos.x, pos.y));
        if (!vertex || element === this.startNode || element === this.endNode || element === this.polyLine) return;
        vertex.isObstacle = this.isObstacleMode;
        element.attr({fill: this.isObstacleMode ? OBSTACLE_BACKGROUND_COLOR : BACKGROUND_COLOR});
    }
    
    private onPaperDragEnd(event: MouseEvent) {
        this.onObstacleFinished?.call(null);
    }

    // Mobile Support
    private onTouchStart(event: TouchEvent): void {
        const x = event.touches[0].clientX;
        const y = event.touches[0].clientY;
        this.onDragStart.call(this, x, y, event);
    }

    private onTouchMove(event: TouchEvent): void {
        const x = event.touches[0].clientX;
        const y = event.touches[0].clientY;
        this.onDrag.call(this, x, y, x, y, event);
    }

    private onTouchEnd(event: TouchEvent): void {
        const x = event.changedTouches[0].clientX;
        const y = event.changedTouches[0].clientY;
        this.onDragEnd.call(this, {x, y});
    }
}
