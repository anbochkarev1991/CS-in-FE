export class DeQueue<T> {
  head: DeQueueNode<T> | null;
  tail: DeQueueNode<T> | null;
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

  getPrevToTail(): DeQueueNode<T> {
    let current = this.head as DeQueueNode<T>;
    for (let i = 0; i < this.size - 1; i++) {
      current = current?.next as DeQueueNode<T>;
    }

    return current;
  }

  pop() {
    if (!this.tail) {
      throw new Error('Queue is empty, nothing to delete')
    }

    const nodeToDelete = this.tail?.value;
    this.tail = this.tail?.prev as DeQueueNode<T>;
    if (this.tail) {
      this.tail.next = null;
    }
    this.size--;
    return nodeToDelete;
  }

  push(value: T): void {
    const newNode = new DeQueueNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = {...newNode};
    } else if (this.size === 1) {
      this.head.next = newNode;
      this.tail = {...newNode};
      this.tail.prev = this.head;
    } else {
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

  unshift(value: T): void {
    const newNode = new DeQueueNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = {...newNode};
    } else {
      let currentHead = this.head;
      this.head = newNode;
      this.head.next = currentHead;
    }
    
    this.size++;
  }

  shift() {
    if (!this.head) {
      throw new Error('Queue is empty, nothing to delete')
    }

    const nodeToDelete = this.head?.value;
    this.head = this.head?.next as DeQueueNode<T>;
    this.size--;
    return nodeToDelete;
  }
}

export class DeQueueNode<T> {
  constructor(
    public value: T,
    public next: DeQueueNode<T> | null = null,
    public prev: DeQueueNode<T> | null = null,
  ){}
}

const dequeue = new DeQueue();
   
dequeue.push(10);
dequeue.unshift(11);
dequeue.push(12);



console.log(dequeue.pop());   // 12
console.log(dequeue.shift()); // 11
console.log(dequeue.pop());   // 10
console.log(dequeue.pop());   // Exception
