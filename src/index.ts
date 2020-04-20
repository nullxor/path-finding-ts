import { Field } from "./field/field";
import { Block } from "./field/block";
import { UndirectedGraph } from "./graph/UndirectedGraph";
import { MainNodes } from "./app/mainnodes";

window.addEventListener('load', () => {
    const graph = new UndirectedGraph<Block>();
    const field = new Field(<SVGElement>document.querySelector('#paper'), graph);
    const mainNodes = new MainNodes(<SVGElement>document.querySelector('#paper'));

    field.allowDiagonals = !true;
    field.blockSize = 30;
    field.grid('#f1f1f1', '#ccc');
    mainNodes.setStartNode(5, 5, '#aaeecc', 'black', 1);
    mainNodes.setEndNode(20, 10, 'green', 'black', 1);
    document.getElementById('bfs').addEventListener('click', () => {
        const start = `${mainNodes.startX}_${mainNodes.startY}`;
        const end = `${mainNodes.endX}_${mainNodes.endY}`;
        console.log(start,end);
        console.log(start, end);
        graph.dijkstra(start, end, async (vertex) => {
            return true;
        }, (shortestPath) => {
            console.log('%cFinished!', 'color: green');
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
    });
    setupMenu(field);

});

async function Sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

function setupMenu(field: Field) {
    const dropdownMenu = document.getElementById('dropdownMenu');
    field.onBlockClick = (event: MouseEvent) => {
        dropdownMenu.style.left = `${event.x}px`;
        dropdownMenu.style.top = `${event.y}px`;
        dropdownMenu.style.display = 'inline';
    };
}