"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeQueueNode = exports.DeQueue = void 0;
class DeQueue {
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
        if (!this.tail) {
            throw new Error('Queue is empty, nothing to delete');
        }
        const nodeToDelete = (_a = this.tail) === null || _a === void 0 ? void 0 : _a.value;
        this.tail = (_b = this.tail) === null || _b === void 0 ? void 0 : _b.prev;
        if (this.tail) {
            this.tail.next = null;
        }
        this.size--;
        return nodeToDelete;
    }
    push(value) {
        const newNode = new DeQueueNode(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = Object.assign({}, newNode);
        }
        else if (this.size === 1) {
            this.head.next = newNode;
            this.tail = Object.assign({}, newNode);
            this.tail.prev = this.head;
        }
        else {
            const prevToTail = this.getPrevToTail();
            if (prevToTail) {
                prevToTail.next = newNode;
            }
            let currentTail = this.tail;
            this.tail = newNode;
            this.tail.prev = currentTail;
        }
        this.size++;
    }
    unshift(value) {
        const newNode = new DeQueueNode(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = Object.assign({}, newNode);
        }
        else {
            let currentHead = this.head;
            this.head = newNode;
            this.head.next = currentHead;
        }
        this.size++;
    }
    shift() {
        var _a, _b;
        if (!this.head) {
            throw new Error('Queue is empty, nothing to delete');
        }
        const nodeToDelete = (_a = this.head) === null || _a === void 0 ? void 0 : _a.value;
        this.head = (_b = this.head) === null || _b === void 0 ? void 0 : _b.next;
        this.size--;
        return nodeToDelete;
    }
}
exports.DeQueue = DeQueue;
class DeQueueNode {
    constructor(value, next = null, prev = null) {
        this.value = value;
        this.next = next;
        this.prev = prev;
    }
}
exports.DeQueueNode = DeQueueNode;
const dequeue = new DeQueue();
dequeue.push(10);
dequeue.unshift(11);
dequeue.push(12);
console.log(dequeue.pop()); // 12
console.log(dequeue.shift()); // 11
console.log(dequeue.pop()); // 10
console.log(dequeue.pop()); // Exception
