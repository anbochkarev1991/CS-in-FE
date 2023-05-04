class LinkedList<T> {
  private head: LinkedListNode<T> | null;
  private tail: LinkedListNode<T> | null;
  private size: number;

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

  checkIndex(index: number) {
    if ((index < 0 || index > this.size) && (index !== 0)) {
      throw new Error(`This index ${index} comes out of linked list bounds`)
    }
  }

  get(index: number): T {
    this.checkIndex(index);

    let current = this.head as LinkedListNode<T>;
    for (let i = 0; i < index; i++) {
      current = current?.next as LinkedListNode<T>;
    }

    return current.value;
  }

  delete(index: number): T {
    this.checkIndex(index);

    let nodeToDelete: LinkedListNode<T>;
    if (index === 0) {
      nodeToDelete = this.head as LinkedListNode<T>;
      this.head = this.head?.next as LinkedListNode<T>;
      if (this.head === null) {
        this.tail = null;
      } else {
        this.head.prev = null;
      } 
    } else if (index === this.size - 1) {
      nodeToDelete = this.tail as LinkedListNode<T>;
      this.tail = this.tail?.prev as LinkedListNode<T>;
      this.tail.next = null;
    } else {
      let currentNode = this.head as LinkedListNode<T>;
      for (let i = 0; i < index; i++) {
        currentNode = currentNode?.next as LinkedListNode<T>;
      }

      nodeToDelete = currentNode;
      (currentNode.prev as LinkedListNode<T>).next = currentNode.next;
      (currentNode.next as LinkedListNode<T>).prev = currentNode.prev;
    }

    this.size--;
    return nodeToDelete.value;
  }

  insert(index: 0 | 1, value: T): LinkedListNode<T> {
    this.checkIndex(index);

    let newNode = new LinkedListNode(value);
    if (index === 0) {
      if (this.head === null) {
        this.head = newNode;
      } else {        
        newNode.next = this.head;
        newNode.prev = null;
        this.head.prev = newNode;
        this.head = newNode;
      }
    } else {
      if (this.tail) {        
        newNode.prev = this.tail;
        newNode.next = null;
        this.tail.next = newNode;
        this.tail = newNode;
      } else {
        (this.head as LinkedListNode<T>).next = newNode;
        newNode.prev = this.head;
        newNode.next = null;
        this.tail = newNode;
      }
    } 

    this.size++;
    return newNode;
  }

  update(index: number, value: T): LinkedListNode<T> {
    this.checkIndex(index);

    let currentNode = this.head as LinkedListNode<T>;
    for (let i = 0; i < index; i++) {
      currentNode = currentNode?.next as LinkedListNode<T>;
    }

    currentNode.value = value;
    return currentNode;
  }
}

export class LinkedListNode<T> {
  constructor(
    public value: T,
    public prev: LinkedListNode<T> | null = null,
    public next: LinkedListNode<T> | null = null,
  ){}
}


const testList = new LinkedList<number>()

testList.insert(0, 10);
testList.insert(1, 20);
testList.insert(1, 30);
testList.update(1, 25);
// console.log(testList);

// console.log(testList.get(1)); // Output: 25
// testList.delete(1);
// console.log(testList.get(1)); // Output: 30

for (const el of testList) {
  console.log(el);
  
}

