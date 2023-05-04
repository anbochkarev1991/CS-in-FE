export class Queue<T> {
  head: QueueNode<T> | null;
  tail: QueueNode<T> | null;
  size: number;

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

  getPrevToTail(): QueueNode<T> {
    let current = this.head as QueueNode<T>;
    for (let i = 0; i < this.size - 1; i++) {
      current = current?.next as QueueNode<T>;
    }

    return current;
  }

  pop() {
    if (!this.head) {
      throw new Error('Queue is empty, nothing to delete')
    }

    const nodeToDelete = this.head?.value;
    this.head = this.head?.next as QueueNode<T>;
    this.size--;
    return nodeToDelete;
  }

  push(value: T): void {
    const newNode = new QueueNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = {...newNode};
    } else if (this.size === 1) {
      this.head.next = newNode;
      this.tail = {...newNode};
    } else {
      const prevToTail = this.getPrevToTail();
      if (prevToTail) {
        prevToTail.next = newNode;
      }
      this.tail = newNode;
    }
    
    this.size++;
  }
}

export class QueueNode<T> {
  constructor(
    public value: T,
    public next: QueueNode<T> | null = null,
  ){}
}

const queue = new Queue();

queue.push(10);
queue.push(11);
queue.push(12);

console.log(queue.head);  // 10

console.log(queue.pop()); // 10

console.log(queue.head);  // 11

console.log(queue.pop()); // 11
console.log(queue.pop()); // 12
console.log(queue.pop()); // Exception