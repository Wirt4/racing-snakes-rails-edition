import { ObjectPool } from '../objectPool/objectPool';
import { Coordinates } from '../geometry/interfaces';

class CoordinatesStack {
	private _top: number = 0;
	private stck: Array<Coordinates>;
	private pool: ObjectPool<Coordinates>;
	constructor(size: number = 1500) {
		this.pool = new ObjectPool<Coordinates>(size, () => ({ x: -1, y: -1 }));
		this.stck = new Array(size);
		this.fillStack(this.stck, 0, size);
	}

	get isEmpty(): boolean {
		return this._top === 0;
	}

	get top(): Coordinates {
		return this.stck[this._top - 1];
	}
	push(x: number, y: number): void {
		this.reallocateIfNecessary();
		this.stck[this._top].x = x;
		this.stck[this._top].y = y;
		this._top++;
	}

	clear(): void {
		for (let i = 0; i < this._top; i++) {
			this.pool.release(this.stck[i]);
		}
		this._top = 0;
	}

	peek(): Coordinates {
		if (this.isEmpty) {
			throw new Error('Stack is empty');
		}
		return this.stck[this._top - 1];
	}

	freetop(): void {
		if (this.isEmpty) {
			throw new Error('Stack is empty');
		}
		this._top--;
		this.pool.release(this.stck[this._top]);
		this.stck[this._top] = this.pool.acquire();
	}

	private reallocateIfNecessary(): void {
		if (this._top >= this.stck.length) {
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
