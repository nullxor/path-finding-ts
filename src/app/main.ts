import { UndirectedGraph, ShortestPath } from "./graph/undirectedGraph";
import { BlockField } from "./field/blockField";
import { Block } from "./field/block";
import { VisualConnection } from "./field/visualConnection";
import { Menu } from "./menu";

export class Main {
    private menu: Menu;
    private graph: UndirectedGraph<Block>;
    private field: BlockField;
    private visualConnection: VisualConnection;

    constructor() {
        this.setup();
    }

    main() {
        const blockSize = <HTMLInputElement>document.getElementById('blockSize');
        
        // Event listeners
        document.getElementById('bfs').addEventListener('click', () => {
            this.runAlgorithm(this.visualConnection, this.graph);
        });
        this.menu = new Menu();
    }

    private setup() {
        this.graph = new UndirectedGraph<Block>();
        this.field = new BlockField(<SVGElement>document.querySelector('#paper'), this.graph);
        this.visualConnection = new VisualConnection(<SVGElement>document.querySelector('#paper'), this.graph);
        this.field.grid();
        this.visualConnection.setStartNode(this.random(1, this.field.maxWidth-1), this.random(1, this.field.maxHeight-1));
        this.visualConnection.setEndNode(this.random(1, this.field.maxWidth-1), this.random(1, this.field.maxHeight-1));
        this.visualConnection.onDragFinished = () => this.runAlgorithm(this.visualConnection, this.graph);        
        this.visualConnection.onObstacleFinished = () => this.runAlgorithm(this.visualConnection, this.graph);        
    }

    private runAlgorithm(connection: VisualConnection, graph: UndirectedGraph<Block>) {
        const blockWeight = <HTMLInputElement>document.getElementById('blockWeight');
        const diagonalWeight = <HTMLInputElement>document.getElementById('diagonalWeight');
        graph.weight = Number(blockWeight.value);
        graph.diagonalWeight = Number(diagonalWeight.value);
        const start = Block.getKey(connection.startX, connection.startY);
        const end = Block.getKey(connection.endX, connection.endY);
        const allowDiagonal = <HTMLInputElement>document.getElementById('allowDiagonal');
        const shortestPath = graph.dijkstra(start, end, allowDiagonal.checked);
        this.showConnections(shortestPath, end, start, connection);
    }

    private showConnections(shortestPath: Map<string, ShortestPath>, end: string, start: string, connection: VisualConnection) {
        let current = shortestPath.get(end);
        let currentKey = end;
        const weight = current && current.weight || -1;
        const connections = [currentKey];
        while (current && currentKey !== start) {
            currentKey = current.previous;
            current = shortestPath.get(currentKey);
            connections.push(currentKey);
        }
        connection.showConnections(connections, weight);
    }

    private random(min, max): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}