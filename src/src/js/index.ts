import { Drawer } from "./field/drawer";
import { Block } from "./field/block";

window.addEventListener('load', () => {
    const drawer = new Drawer(<HTMLCanvasElement>document.getElementById('stage'));
    const block = new Block(1, 1, 10);
    drawer.draw(block);
});
