import { PriorityQueue } from "../../src/queue/priorityqueue";

let queue: PriorityQueue<number>;
const testCase = [8, 3, 1, 4, 5, 2, 9, 7, 6];

beforeEach(() => {
    queue = new PriorityQueue<number>();
    testCase.forEach(item => queue.enqueue(item, item));
});

test('It should enqueue by priority', () => {
    const item = queue.dequeue();
    expect(item).toBe(1);
});

test('It should return correct length', () => {
    expect(queue.length).toBe(testCase.length);
    queue.dequeue();
    expect(queue.length).toBe(testCase.length - 1);
});

test('It should sort by ascending after remove all items', () => {
    let i = 1;
    while (queue.length > 0) {
        const item = queue.dequeue();
        expect(item).toBe(i++);
    }
});

test('It should return falsy if the queue is empty', () => {
    while (queue.length > 0) {
        const item = queue.dequeue();
    }
    expect(queue.dequeue()).toBeFalsy();
});
