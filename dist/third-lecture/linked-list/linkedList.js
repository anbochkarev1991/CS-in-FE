"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedListNode = void 0;
class LinkedList {
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
    checkIndex(index) {
        if ((index < 0 || index > this.size) && (index !== 0)) {
            throw new Error(`This index ${index} comes out of linked list bounds`);
        }
    }
    get(index) {
        this.checkIndex(index);
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current === null || current === void 0 ? void 0 : current.next;
        }
        return current.value;
    }
    delete(index) {
        var _a, _b;
        this.checkIndex(index);
        let nodeToDelete;
        if (index === 0) {
            nodeToDelete = this.head;
            this.head = (_a = this.head) === null || _a === void 0 ? void 0 : _a.next;
            if (this.head === null) {
                this.tail = null;
            }
            else {
                this.head.prev = null;
            }
        }
        else if (index === this.size - 1) {
            nodeToDelete = this.tail;
            this.tail = (_b = this.tail) === null || _b === void 0 ? void 0 : _b.prev;
            this.tail.next = null;
        }
        else {
            let currentNode = this.head;
            for (let i = 0; i < index; i++) {
                currentNode = currentNode === null || currentNode === void 0 ? void 0 : currentNode.next;
            }
            nodeToDelete = currentNode;
            currentNode.prev.next = currentNode.next;
            currentNode.next.prev = currentNode.prev;
        }
        this.size--;
        return nodeToDelete.value;
    }
    insert(index, value) {
        this.checkIndex(index);
        let newNode = new LinkedListNode(value);
        if (index === 0) {
            if (this.head === null) {
                this.head = newNode;
            }
            else {
                newNode.next = this.head;
                newNode.prev = null;
                this.head.prev = newNode;
                this.head = newNode;
            }
        }
        else {
            if (this.tail) {
                newNode.prev = this.tail;
                newNode.next = null;
                this.tail.next = newNode;
                this.tail = newNode;
            }
            else {
                this.head.next = newNode;
                newNode.prev = this.head;
                newNode.next = null;
                this.tail = newNode;
            }
        }
        this.size++;
        return newNode;
    }
    update(index, value) {
        this.checkIndex(index);
        let currentNode = this.head;
        for (let i = 0; i < index; i++) {
            currentNode = currentNode === null || currentNode === void 0 ? void 0 : currentNode.next;
        }
        currentNode.value = value;
        return currentNode;
    }
}
class LinkedListNode {
    constructor(value, prev = null, next = null) {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}
exports.LinkedListNode = LinkedListNode;
const testList = new LinkedList();
testList.insert(0, 10);
testList.insert(1, 20);
testList.insert(1, 30);
testList.update(1, 25);
// console.log(testList);
// console.log(testList.get(1)); // Output: 25
testList.delete(1);
// console.log(testList.get(1)); // Output: 30
for (const el of testList) {
    console.log(el);
}
