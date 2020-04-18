import { Field } from "./field/field";
import { Block } from "./field/block";
import { UndirectedGraph } from "./graph/UndirectedGraph";

window.addEventListener('load', () => {
    const graph = new UndirectedGraph<Block>();
    const field = new Field(<SVGElement>document.querySelector('#paper'), graph);
    field.allowDiagonals = true;
    field.blockSize = 50;
    field.grid();
    document.getElementById('bfs').addEventListener('click', () => {
        graph.dfs('0_0', async (vertex) => {
            field.setBlock(vertex.value.x, vertex.value.y, 'red', 'black');
            await Sleep(10);
            field.setBlock(vertex.value.x, vertex.value.y, '#aadece', 'black');
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
