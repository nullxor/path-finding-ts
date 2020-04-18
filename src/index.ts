import { Field } from "./field/field";
import { Block } from "./field/block";

window.addEventListener('load', () => {
    const drawer = new Field(<SVGElement>document.querySelector('#paper'));
    const block = new Block(10, 10, 40);

    block.backgroundColor = 'blue';
    drawer.blockSize = 40;
    drawer.grid();

});
