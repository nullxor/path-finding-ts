/**
 * Implement a PriorityQueue using a Min Heap
 */
export class PriorityQueue<T> {
     array: PriorityQueueItem<T>[] = [];

    /**
     * Length
     */
    get length(): number {
        return this.array.length;
    }

    /**
     * Enqueue an Item
     * @param priority Priority (Lowest should be the first item)
     * @param item Item
     */
    enqueue(priority: number, item: T) {
        this.array.push(new PriorityQueueItem<T>(priority, item));
        this.siftUp(this.array.length - 1);
    }

    /**
     * Dequeue the highest priority value
     */
    dequeue(): T {
        const lastItem = this.array.pop();
        if (this.array.length > 0) {
            const min = this.array[0].item;
            this.array[0] = lastItem;
            this.siftDown(0);
            return min;
        }
        return lastItem?.item;
    }

    /**
     * Ensures the Heap' invariant (Parent should be always lower than children)
     * @param index Start index
     */
    private siftDown(index: number) {
        const leftIndex = (index * 2) + 1, rightIndex = (index * 2) + 2;
        let minIndex = index;
        if (leftIndex < this.array.length && this.array[leftIndex].priority < this.array[minIndex].priority) {
            minIndex = leftIndex;
        }
        if (rightIndex < this.array.length && this.array[rightIndex].priority < this.array[minIndex].priority) {
            minIndex = rightIndex;
        }
        if (minIndex !== index) {
            [this.array[index], this.array[minIndex]] = [this.array[minIndex], this.array[index]];
            this.siftDown(minIndex); 
        }
    }

    /**
     * Ensures the Heap' invariant upwards (Parent should be always lower than children)
     * @param index Start index
     */
    private siftUp(index: number) {
        const parentIndex = Math.round(index / 2) - 1;
        if (index > 0 && index < this.array.length && this.array[index].priority < this.array[parentIndex].priority) {
            [this.array[index], this.array[parentIndex]] = [this.array[parentIndex], this.array[index]];
            this.siftUp(parentIndex);
        }
    }
}

/**
 * Model
 */
class PriorityQueueItem<T> {
    constructor(public priority: number, public item: T) {}
}