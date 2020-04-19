/**
 * Doubly Linked List based queue
 */
export class Queue<T> {
    private head: Node<T> = null;
    private tail: Node<T> = null;
    private len: number = 0;

    enqueue(item: T): void {
        this. addFront(item);
    }

    dequeue(): T {
        return this.removeBack();
    }

    get length() {
        return this.len;
    }

    private addFront(item: T): void {
        const node: Node<T> = { item, next: this.head, previous: null };
        if (this.head !== null) {
            this.head.previous = node;
        } 
        this.head = node;
        if (this.tail === null) {
            this.tail = node;
        }
        this.len++;
    }

    private removeBack(): T {
        let item: T = null;
        if (this.tail !== null) {
            item = this.tail.item;
            if (this.tail.previous !== null) {
                this.tail = this.tail.previous;
                this.tail.next = null;
            } else {
                this.head = this.tail = null;
            }
            this.len--;
        }
        return item;
    }
}

interface Node<T> {
    item: T;
    next: Node<T>;
    previous: Node<T>;
}