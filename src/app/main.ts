import { UndirectedGraph } from "../graph/undirectedGraph";
import { BlockField } from "../field/blockField";
import { Block } from "../field/block";
import { VisualConnection } from "../field/visualConnection";
import { Menu } from "./menu";

const BLOCK_SIZE = 40;
const GRID_BACKGROUND_COLOR = '#f1f1f1';
const GRID_BORDER_COLOR = '#ccc';

const START_NODE_BACKGROUND_COLOR = 'rgba(41, 128, 185, 0.5)';
const START_NODE_STROKE_COLOR = 'black';
const END_NODE_BACKGROUND_COLOR = 'rgba(39, 174, 96, 0.5)';
const END_NODE_STROKE_COLOR = 'black';
export class Main {
    private menu: Menu;
    private graph: UndirectedGraph<Block>;
    private field: BlockField;
    private visualConnection: VisualConnection;

    constructor() {
        this.setup(GRID_BACKGROUND_COLOR, GRID_BORDER_COLOR, BLOCK_SIZE);
    }

    main() {
        const backgroundColor = <HTMLInputElement>document.getElementById('backgroundColor');
        const borderColor = <HTMLInputElement>document.getElementById('borderColor');
        const blockSize = <HTMLInputElement>document.getElementById('blockSize');
        
        // Event listeners
        document.getElementById('bfs').addEventListener('click', () => {
            this.menu.hide();
            this.runAlgorithm(this.visualConnection, this.graph);
        });

        backgroundColor.addEventListener('change', () => this.field.setBackgroundColor(backgroundColor.value));
        borderColor.addEventListener('change', () => this.field.setBorderColor(borderColor.value));
        blockSize.addEventListener('change', () => this.setup(backgroundColor.value, borderColor.value, Number(blockSize.value)));
    }

    private setup(backgroundColor: string, borderColor: string, blockSize: number) {
        this.menu = new Menu();
        this.graph = new UndirectedGraph<Block>();
        this.field = new BlockField(<SVGElement>document.querySelector('#paper'), this.graph);
        this.visualConnection = new VisualConnection(<SVGElement>document.querySelector('#paper'), this.graph);
        this.field.blockSize = this.visualConnection.blockSize = blockSize;
        this.field.grid(backgroundColor, borderColor);
        this.visualConnection.setStartNode(this.random(1, this.field.maxWidth-1), this.random(1, this.field.maxHeight-1), START_NODE_BACKGROUND_COLOR, START_NODE_STROKE_COLOR, 1);
        this.visualConnection.setEndNode(this.random(1, this.field.maxWidth-1), this.random(1, this.field.maxHeight-1), END_NODE_BACKGROUND_COLOR, END_NODE_STROKE_COLOR, 1);
        this.visualConnection.onDragFinished = () => this.runAlgorithm(this.visualConnection, this.graph);        
    }

    private runAlgorithm(connection: VisualConnection, graph: UndirectedGraph<Block>) {
        const blockWeight = <HTMLInputElement>document.getElementById('blockWeight');
        const diagonalWeight = <HTMLInputElement>document.getElementById('diagonalWeight');
        graph.weight = Number(blockWeight.value);
        graph.diagonalWeight = Number(diagonalWeight.value);
        const start = `${connection.startX}_${connection.startY}`;
        const end = `${connection.endX}_${connection.endY}`;
        const allowDiagonal = <HTMLInputElement>document.getElementById('allowDiagonal');
        const shortestPath = graph.dijkstra(start, end, allowDiagonal.checked);
        let current = shortestPath.get(end);
        let currentKey = end;
        const connections = [currentKey];
        while (currentKey !== start) {
            currentKey = current.previous;
            current = shortestPath.get(currentKey);
            connections.push(currentKey);
        }
        connection.showConnections(connections);
    }

    private random(min, max): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}