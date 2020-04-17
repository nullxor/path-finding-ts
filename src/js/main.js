// import { Drawer } from "draw/drawer.js";

window.addEventListener('load', () => {
    const drawer = new Drawer(document.getElementById('stage'), 50);
    const block = new Block(1, 1, 10);
    drawer.draw(block);
    drawer.draw(block2);
});
