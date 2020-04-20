import { BlockField } from "./field/blockField";
import { Block } from "./field/block";
import { UndirectedGraph } from "./graph/undirectedGraph";
import { MainNodes } from "./app/mainnodes";

window.addEventListener('load', () => {
    const graph = new UndirectedGraph<Block>();
    const field = new BlockField(<SVGElement>document.querySelector('#paper'), graph);
    const mainNodes = new MainNodes(<SVGElement>document.querySelector('#paper'));
    field.blockSize = mainNodes.blockSize = 40;
    field.allowDiagonals = true;
    field.grid('#f1f1f1', '#ccc');
    mainNodes.setStartNode(1, 1, '#aaeecc', 'black', 1);
    mainNodes.setEndNode(2, 4, 'green', 'black', 1);
    document.getElementById('bfs').addEventListener('click', () => {
        const start = `${mainNodes.startX}_${mainNodes.startY}`;
        const end = `${mainNodes.endX}_${mainNodes.endY}`;
        const shortestPath = graph.dijkstra(start, end);
        let current = shortestPath.get(end);
        let currentKey = end;
        const connections = [currentKey];
        while(currentKey !== start) {
            currentKey = current.previous;
            current = shortestPath.get(currentKey);
            connections.push(currentKey);
        }
        field.showConnections(connections);
    });
    setupMenu(field);
});

function setupMenu(field: BlockField) {
    const dropdownMenu = document.getElementById('dropdownMenu');
    field.onBlockClick = (event: MouseEvent) => {
        dropdownMenu.style.left = `${event.x}px`;
        dropdownMenu.style.top = `${event.y}px`;
        dropdownMenu.style.display = 'inline';
    };
}