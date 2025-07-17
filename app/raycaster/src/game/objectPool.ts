
export class ObjectPool<T> {
	private top: number = 0;
	private pool: T[];

	constructor(size: number = 1500, private factory: () => T) {
		this.pool = new Array(size);
		for (let i = 0; i < size; i++) {
			this.pool[i] = this.factory();
		}
		this.top = size;
	}

	acquire(): T {
		if (this.top == 0) {
			this.reallocate();
		}
		this.top--;
		return this.pool[this.top];
	}

	release(object: T): void {
		if (this.top === this.pool.length) {
			throw new Error('Object pool overflow, you may not release an object that was not acquired from this pool');
		}
		this.pool[this.top] = object;
		this.top++;
	}

	private reallocate(): void {
		const newSize = this.pool.length * 2;
		const newPool = new Array<T>(newSize);
		for (let i = 0; i < this.pool.length; i++) {
			newPool[i + this.pool.length] = this.pool[i];
			newPool[i] = this.factory();
		}
		this.top = this.pool.length;
		this.pool = newPool;
	}
}
