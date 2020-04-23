import { Queue } from "../queue/queue";
import { PriorityQueue } from "../queue/priorityqueue";

/**
 * Undirected graph
 */
export class UndirectedGraph<T> {
    weight = 1;
    diagonalWeight = 1.5;
    private edgeList = new Map<string, Edge<T>[]>();
    private vertices = new Map<string, Vertex<T>>(); 

    set(label: string, value: T) {
        if (!this.vertices.has(label)) {
            this.vertices.set(label, { label, value, isObstacle: false });
            this.edgeList.set(label, []);
        }
    }

    get(label: string): T {
        return this.vertices.get(label).value;
    }

    getVertex(label: string): Vertex<T> {
        return this.vertices.get(label);
    }

    connect(v1: string, v2: string, weight: number, isDiagonal = false) {
        const vertex1 = this.vertices.get(v1);
        const vertex2 = this.vertices.get(v2); 
        const edgesV1 = this.edgeList.get(v1);
        const edgesV2 = this.edgeList.get(v2);
        edgesV1.push({from: vertex1, to: vertex2, weight, isDiagonal});
        edgesV2.push({from: vertex2, to: vertex1, weight, isDiagonal});
    }

    bfs(start: string, callback: (vertex: Vertex<T>) => boolean) {
        const queue = new Queue<Vertex<T>>();
        const visited = new Map<string, boolean>();
        let currentVertex: Vertex<T>;
        let keepGoing = true;
        queue.enqueue(this.vertices.get(start));
        while (keepGoing && queue.length > 0) {
            currentVertex = queue.dequeue();
            if (!visited.has(currentVertex.label)) {
                visited.set(currentVertex.label, true);
                keepGoing = callback(currentVertex);
            for (const edge of this.edgeList.get(currentVertex.label)) {
                    queue.enqueue(edge.to);
                }
            }
        }
    }

    dfs(start: string, callback: (vertex: Vertex<T>) => boolean) {
        const stack = [this.vertices.get(start)];
        const visited = new Map<string, boolean>();
        let currentVertex: Vertex<T>;
        let keepGoing = true;
        while (keepGoing && stack.length > 0) {
            currentVertex = stack.pop();
            if (!visited.has(currentVertex.label)) {
                visited.set(currentVertex.label, true);
                keepGoing = callback(currentVertex);
            for (const edge of this.edgeList.get(currentVertex.label)) {
                    stack.push(edge.to);
                }
            }
        }
    }

    dijkstra(start: string, end: string, allowDiagonal = false): Map<string, ShortestPath> {
        const queue = new PriorityQueue<Vertex<T>>();
        const shortestPath = new Map<string, ShortestPath>();
        let currentVertex: Vertex<T>;
        queue.enqueue(0, this.vertices.get(start));
        shortestPath.set(start, { previous: '', weight: 0 });
        while (queue.length > 0) {
            currentVertex = queue.dequeue();
            for (const edge of this.edgeList.get(currentVertex.label)) {
                if (edge.isDiagonal && !allowDiagonal) continue;
                this.relax(edge, shortestPath, queue);
            }
        }
        return shortestPath;
    }

    private relax(edge: Edge<T>, shortestPath: Map<string, ShortestPath>, queue: PriorityQueue<Vertex<T>>): void {
        if (edge.to.isObstacle) {
            return;
        }
        if (!shortestPath.has(edge.to.label)) {
            shortestPath.set(edge.to.label, { previous: edge.from.label, weight: Infinity });
        }
        const neighbour = shortestPath.get(edge.to.label);
        const newWeight = shortestPath.get(edge.from.label).weight + this.getWeight(edge);
        if (newWeight < neighbour.weight) {
            neighbour.previous = edge.from.label;
            neighbour.weight = newWeight;
            queue.enqueue(newWeight, edge.to);
        }
    }

    private getWeight(edge: Edge<T>): number {
        return edge.isDiagonal ? this.diagonalWeight : this.weight;
    }
}

export interface ShortestPath {
    weight: number;
    previous: string;
}

export interface Vertex<T> {
    label: string;
    value: T;
    isObstacle: boolean;
}

export interface Edge<T> {
    from: Vertex<T>;
    to: Vertex<T>;
    weight: number;
    isDiagonal: boolean;
}