# Path finding algorithms in TypeScript

Tiny project that I developed on spare time to learn TypeScript, SVG and as a Graph algorithms refresher. Demo: [https://nullxor.github.io/graphs/index.html](https://nullxor.github.io/graphs/index.html) 

Inspired by [PathFinding.js](http://qiao.github.io/PathFinding.js/visual/).

This repo contains the implementation of the following Data Structures / Algorithms in TypeScript:
* A* and Dijkstra algorithm  
* Heap based priority queue
* Doubly linked list based queue
* BFS and DFS algorithm (Not used ATM)

## Features
* Drag start (blue) and destination (green) vertex around the screen and choose from 2 path finding algorithms (Dijkstra and A*).
* Set the block and diagonal weight.
* Add obstacles by start dragging on any empty grid block
* Remove obstacles by start dragging on any obstacle.

Each block is a graph vertex and they're connected through a visual representation. It works on mobile so you should be able to touch and drag the nodes around the screen on mobile devices.

## Libraries
* [Snap SVG](https://snapsvg.io)
* [Bulma](https://bulma.io/)
* [Font Awesome](https://fontawesome.com/)

## Build
1. Clone this repo
2. npm install && npm run build

## License
MIT

## TODO
* Implement A*
