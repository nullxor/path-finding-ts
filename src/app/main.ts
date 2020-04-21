import { UndirectedGraph } from "../graph/undirectedGraph";
import { BlockField } from "../field/blockField";
import { Block } from "../field/block";
import { VisualConnection } from "../field/visualConnection";

const BLOCK_SIZE = 40;
const GRID_BACKGROUND_COLOR = '#f1f1f1';
const GRID_STROKE_COLOR = '#ccc';

const START_NODE_BACKGROUND_COLOR = 'rgba(41, 128, 185, 0.5)';
const START_NODE_STROKE_COLOR = 'black';
const END_NODE_BACKGROUND_COLOR = 'rgba(39, 174, 96, 0.5)';
const END_NODE_STROKE_COLOR = 'black';
export class Main {
    main() {
        const graph = new UndirectedGraph<Block>();
        const field = new BlockField(<SVGElement>document.querySelector('#paper'), graph);
        const connection = new VisualConnection(<SVGElement>document.querySelector('#paper'), graph);
        field.blockSize = connection.blockSize = BLOCK_SIZE;
        field.grid(GRID_BACKGROUND_COLOR, GRID_STROKE_COLOR);
        connection.setStartNode(this.random(0, field.maxWidth), this.random(0, field.maxHeight), START_NODE_BACKGROUND_COLOR, START_NODE_STROKE_COLOR, 1);
        connection.setEndNode(this.random(0, field.maxWidth), this.random(0, field.maxHeight), END_NODE_BACKGROUND_COLOR, END_NODE_STROKE_COLOR, 1);
        document.getElementById('bfs').addEventListener('click', () => {
            this.runAlgorithmClick(connection, graph);
        });
    }

    private runAlgorithmClick(connection: VisualConnection, graph: UndirectedGraph<Block>) {
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