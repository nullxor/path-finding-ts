import Snap from "snapsvg";

/**
 * Visual representation of the 2 main nodes and the link between them
 */
export class MainNodes {
    blockSize = 30;
    private paper: Snap.Paper;
    private startNode: Snap.Element = null;
    private endNode: Snap.Element = null;

    /**
     * Default constructor
     * @param {SVGAElement} svgElement SVG element
     */
    constructor(private svgElement: SVGElement) {
        this.paper = Snap(svgElement);
    }

    setStartNode(x: number, y: number, backgroundColor: string, borderColor: string, borderWidth = 1) {
        if (!this.startNode) {
            this.startNode = this.paper.rect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
            this.startNode.drag(this.onDrag.bind(this, this.startNode), null, this.onDragEnd.bind(this, this.startNode));
        }
        this.setNode(this.startNode, x, y, backgroundColor, borderColor, borderWidth);
    }

    setEndNode(x: number, y: number, backgroundColor: string, borderColor: string, borderWidth = 1) {
        if (!this.endNode) {
            this.endNode = this.paper.rect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
            this.endNode.drag(this.onDrag.bind(this, this.endNode), null, this.onDragEnd.bind(this, this.endNode));
        }
        this.setNode(this.endNode, x * this.blockSize, y * this.blockSize, backgroundColor, borderColor, borderWidth);
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
        element.attr({x, y});
    }

    private onDragEnd(element: Snap.Element, event: MouseEvent): void {
        element.attr({x: this.getPositionX(element) * this.blockSize, y: this.getPositionY(element) * this.blockSize});
    }
}
