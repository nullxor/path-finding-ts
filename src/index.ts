import { Field } from "./field/field";
import { Block } from "./field/block";
import { UndirectedGraph } from "./graph/UndirectedGraph";

window.addEventListener('load', () => {
    const graph = new UndirectedGraph<Block>();
    const drawer = new Field(<SVGElement>document.querySelector('#paper'), graph);
    const block = new Block(10, 10);

    drawer.blockSize = 30;
    drawer.grid();
    
    document.getElementById('bfs').addEventListener('click', () => {
        graph.dfs('0_0', async (vertex) => {
            drawer.setBlock(vertex.value.x, vertex.value.y, 'red', 'black');
            await Sleep(1);
            drawer.setBlock(vertex.value.x, vertex.value.y, 'blue', 'black');
            return true;
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

