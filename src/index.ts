import { Field } from "./field/field";
import { Block } from "./field/block";
import { UndirectedGraph } from "./graph/UndirectedGraph";

const DEST = '10_8';
const START = '0_10';

window.addEventListener('load', () => {
    const graph = new UndirectedGraph<Block>();
    const field = new Field(<SVGElement>document.querySelector('#paper'), graph);
    field.allowDiagonals = !true;
    field.blockSize = 50;
    field.grid();
    field.setBlock(10, 8, 'black', 'black');
    field.setBlock(0, 10, 'blue', 'blue');
    document.getElementById('bfs').addEventListener('click', () => {
        graph.dijkstra(START, DEST, async (vertex) => {
            return true;
        }, (shortestPath) => {
            console.log('%cFinished!', 'color: green');
            let current = shortestPath.get(DEST);
            let currentKey = DEST;
            console.log(current.weight)
            while(currentKey !== START) {
                currentKey = current.previous;
                current = shortestPath.get(currentKey);
                const split = currentKey.split('_');
                field.setBlock(Number(split[0]), Number(split[1]), 'green', 'black');
            }
        });
    });
});

async function Sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
