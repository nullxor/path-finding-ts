import { Field } from "./field/field";
import { Block } from "./field/block";
import { UndirectedGraph } from "./graph/UndirectedGraph";

const DEST = '20_8';
const START = '0_0';


window.addEventListener('load', () => {
    const graph = new UndirectedGraph<Block>();
    const field = new Field(<SVGElement>document.querySelector('#paper'), graph);
    field.allowDiagonals = true;
    field.blockSize = 30;
    field.grid('#f1f1f1', '#ccc');
    field.setBlockByKey(DEST, 'black', 'black');
    field.setBlockByKey(START, 'blue', 'blue');
    document.getElementById('bfs').addEventListener('click', () => {
        graph.dijkstra(START, DEST, async (vertex) => {
            return true;
        }, (shortestPath) => {
            console.log('%cFinished!', 'color: green');
            let current = shortestPath.get(DEST);
            let currentKey = DEST;
            const connections = [currentKey];
            while(currentKey !== START) {
                currentKey = current.previous;
                current = shortestPath.get(currentKey);
                connections.push(currentKey);
                //field.setBlockByKey(currentKey, 'green', 'black');
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
        console.log(event.x, event.y);
    };
}