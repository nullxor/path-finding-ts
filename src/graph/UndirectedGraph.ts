import { Queue } from "../queue/queue";
import { PriorityQueue } from "../queue/priorityQueue";

/**
 * Undirected graph
 */
export class UndirectedGraph<T> {
    private list = new Map<string, Edge<T>[]>();
    private vertices = new Map<string, Vertex<T>>(); 

    set(label: string, value: T) {
        if (!this.vertices.has(label)) {
            const vertex = <Vertex<T>> { label, value };
            this.vertices.set(label, vertex);
            this.list.set(label, [] )
        }
    }

    connect(v1: string, v2: string, weight: number) {
        const vertex1 = this.vertices.get(v1);
        const vertex2 = this.vertices.get(v2); 
        const edgesV1 = this.list.get(v1);
        const edgesV2 = this.list.get(v2);
        const edgeV1 = { from: vertex1, to: vertex2, weight };
        const edgeV2 = { from: vertex2, to: vertex1, weight };
        edgesV1.push(edgeV1);
        edgesV2.push(edgeV2);
    }

    async bfs(start: string, callback: (vertex: Vertex<T>) => Promise<boolean>, callbackFinished?: () => void) {
        const queue = new Queue<Vertex<T>>();
        const visited = new Map<string, boolean>();
        let currentVertex: Vertex<T>;
        let keepGoing = true;
        queue.enqueue(this.vertices.get(start));
        while (keepGoing && queue.length > 0) {
            currentVertex = queue.dequeue();
            if (!visited.has(currentVertex.label)) {
                visited.set(currentVertex.label, true);
                keepGoing = await callback(currentVertex);
            for (const edge of this.list.get(currentVertex.label)) {
                    queue.enqueue(edge.to);
                }
            }
        }
        callbackFinished?.call(currentVertex);
    }

    async dfs(start: string, callback: (vertex: Vertex<T>) => Promise<boolean>, callbackFinished?: () => void) {
        const stack = [this.vertices.get(start)];
        const visited = new Map<string, boolean>();
        let currentVertex: Vertex<T>;
        let keepGoing = true;
        while (keepGoing && stack.length > 0) {
            currentVertex = stack.pop();
            if (!visited.has(currentVertex.label)) {
                visited.set(currentVertex.label, true);
                keepGoing = await callback(currentVertex);
            for (const edge of this.list.get(currentVertex.label)) {
                    stack.push(edge.to);
                }
            }
        }
        callbackFinished?.call(currentVertex);
    }

    async dijkstra(start: string, end: string, callback: (vertex: Vertex<T>) => Promise<boolean>, callbackFinished?: (shortestPath: Map<string, ShortestPath>) => void) {
        const queue = new PriorityQueue<Vertex<T>>();
        const visited = new Map<string, boolean>();
        const shortestPath = new Map<string, ShortestPath>();
        let currentVertex: Vertex<T>;
        let keepGoing = true;
        queue.enqueue(0, this.vertices.get(start));
        shortestPath.set(start, { previous: '', weight: 0 });
        while (keepGoing && queue.length > 0) {
            currentVertex = queue.dequeue();
            if (!visited.has(currentVertex.label)) {
                visited.set(currentVertex.label, true);
                keepGoing = await callback(currentVertex);
                for (const edge of this.list.get(currentVertex.label)) {
                    this.relax(edge, shortestPath);
                    if (edge.to.label === end) keepGoing = false;
                    queue.enqueue(shortestPath.get(edge.to.label).weight, edge.to);
                }
            }
        }
        callbackFinished?.call(this, shortestPath);
    }

    private relax(edge: Edge<T>, shortestPath: Map<string, ShortestPath>) {
        if (!shortestPath.has(edge.to.label)) {
            shortestPath.set(edge.to.label, { previous: '', weight: Infinity });
        }
        const currentWeight = shortestPath.get(edge.to.label).weight;
        const newWeight = shortestPath.get(edge.from.label).weight + edge.weight;
        if (newWeight < currentWeight) {
            const info = shortestPath.get(edge.to.label);
            info.previous = edge.from.label;
            info.weight = newWeight;
        }
    }
}

export interface ShortestPath {
    weight: number;
    previous: string;
}

export interface Vertex<T> {
    label: string;
    value: T;
}

export interface Edge<T> {
    from: Vertex<T>;
    to: Vertex<T>;
    weight: number;
}