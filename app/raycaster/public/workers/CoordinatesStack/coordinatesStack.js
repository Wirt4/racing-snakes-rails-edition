import { ObjectPool } from '../objectPool/objectPool';
class CoordinatesStack {
    constructor(size = 1500) {
        this.index = 0;
        this.pool = new ObjectPool(size, () => ({ x: -1, y: -1 }));
        this.stck = new Array(size);
        this.fillStack(this.stck, 0, size);
    }
    get isEmpty() {
        return this.index === 0;
    }
    get top() {
        if (this.isEmpty) {
            throw new Error('Stack is empty');
        }
        return this.stck[this.index - 1];
    }
    push(x, y) {
        this.reallocateIfNecessary();
        this.stck[this.index].x = x;
        this.stck[this.index].y = y;
        this.index++;
    }
    clear() {
        for (let i = 0; i < this.index; i++) {
            this.pool.release(this.stck[i]);
        }
        this.index = 0;
    }
    freetop() {
        if (this.isEmpty) {
            throw new Error('Stack is empty');
        }
        this.index--;
        this.pool.release(this.stck[this.index]);
        this.stck[this.index] = this.pool.acquire();
    }
    reallocateIfNecessary() {
        if (this.index >= this.stck.length) {
            this.reallocate();
        }
    }
    reallocate() {
        const newSize = this.stck.length * 2;
        const newStack = new Array(newSize);
        this.fillStack(newStack, this.stck.length, newSize);
        this.copyInto(newStack, this.stck, this.stck.length);
        this.stck = newStack;
    }
    copyInto(target, source, size) {
        for (let i = 0; i < size; i++) {
            target[i] = source[i];
        }
    }
    fillStack(stack, start, length) {
        for (let i = start; i < length; i++) {
            stack[i] = this.pool.acquire();
        }
    }
}
export { CoordinatesStack };
