"use strict";
class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    *[Symbol.iterator]() {
        let current = this.head;
        while (current !== null) {
            yield current.value;
            current = current.next;
        }
    }
    getPrevToTail() {
        let current = this.head;
        for (let i = 0; i < this.size - 1; i++) {
            current = current === null || current === void 0 ? void 0 : current.next;
        }
        return current;
    }
    pop() {
        var _a, _b;
        if (!this.head) {
            throw new Error('Queue is empty, nothing to delete');
        }
        const nodeToDelete = (_a = this.head) === null || _a === void 0 ? void 0 : _a.value;
        this.head = (_b = this.head) === null || _b === void 0 ? void 0 : _b.next;
        this.size--;
        return nodeToDelete;
    }
    push(value) {
        const newNode = new QueueNode(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = Object.assign({}, newNode);
        }
        else if (this.size === 1) {
            this.head.next = newNode;
            this.tail = Object.assign({}, newNode);
        }
        else {
            const prevToTail = this.getPrevToTail();
            if (prevToTail) {
                prevToTail.next = newNode;
            }
            this.tail = newNode;
        }
        this.size++;
    }
}
class QueueNode {
    constructor(value, next = null) {
        this.value = value;
        this.next = next;
    }
}
const queue = new Queue();
queue.push(10);
queue.push(11);
queue.push(12);
console.log(queue.head); // 10
console.log(queue.pop()); // 10
console.log(queue.head); // 11
console.log(queue.pop()); // 11
console.log(queue.pop()); // 12
console.log(queue.pop()); // Exception
