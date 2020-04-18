import { Queue } from "../../src/queue/queue";

let queue: Queue<number>;
const testCase = [1, 2, 3, 4, 5, 6, 7, 8];

beforeEach(() => {
    queue = new Queue<number>();
    testCase.forEach(item => queue.enqueue(item));
});

test('It should enqueue by FIFO', () => {
    for (let i = 0; i < testCase.length; i++) {
        const item = queue.dequeue();
        expect(item).toBe(testCase[i]);
    }
});

test('It should return correct length', () => {
    expect(queue.length).toBe(testCase.length);
    queue.dequeue();
    expect(queue.length).toBe(testCase.length - 1);
});

test('It should return correct length after removing all items', () => {
    let i = 1;
    while (queue.length > 0) {
        const item = queue.dequeue();
    }
    expect(queue.length).toBe(0);
    queue.enqueue(1);
    expect(queue.length).toBe(1);
});

test('It should return falsy if the queue is empty', () => {
    while (queue.length > 0) {
        queue.dequeue();
    }
    expect(queue.dequeue()).toBeFalsy();
});
