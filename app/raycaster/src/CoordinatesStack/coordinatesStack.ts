import { ObjectPool } from '../objectPool/objectPool';
import { Coordinates } from '../geometry/interfaces';

class CoordinatesStack {
	private top: number;
	private stck: Array<Coordinates>;
	private pool: ObjectPool<Coordinates>;
	constructor(size: number = 1500) {
		this.pool = new ObjectPool<Coordinates>(size, () => ({ x: -1, y: -1 }));
		this.top = 0;
		this.stck = new Array(size);
		this.fillStack(this.stck, 0, size);
	}

	get isEmpty(): boolean {
		return this.top === 0;
	}

	push(x: number, y: number): void {
		this.reallocateIfNecessary();
		this.stck[this.top].x = x;
		this.stck[this.top].y = y;
		this.top++;
	}

	clear(): void {
		for (let i = 0; i < this.top; i++) {
			this.pool.release(this.stck[i]);
		}
		this.top = 0;
	}

	peek(): Coordinates {
		if (this.isEmpty) {
			throw new Error('Stack is empty');
		}
		return this.stck[this.top - 1];
	}

	freetop(): void {
		if (this.isEmpty) {
			throw new Error('Stack is empty');
		}
		this.top--;
		this.pool.release(this.stck[this.top]);
		this.stck[this.top] = this.pool.acquire();
	}

	private reallocateIfNecessary(): void {
		if (this.top >= this.stck.length) {
			this.reallocate();
		}
	}

	private reallocate(): void {
		const newSize = this.stck.length * 2;
		const newStack = new Array(newSize);
		this.fillStack(newStack, this.stck.length, newSize);
		this.copyInto(newStack, this.stck, this.stck.length);
		this.stck = newStack;
	}

	private copyInto(target: Array<Coordinates>, source: Array<Coordinates>, size: number): void {
		for (let i = 0; i < size; i++) {
			target[i] = source[i];
		}
	}

	private fillStack(stack: Array<Coordinates>, start: number, length: number): void {
		for (let i = start; i < length; i++) {
			stack[i] = this.pool.acquire();
		}
	}
}

export { CoordinatesStack };
