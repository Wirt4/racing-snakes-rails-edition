import { TrailInterface } from './interface';
import { ColorName } from '../color/color_name';

class Trail implements TrailInterface {
	head: { x: number, y: number } = { x: -1, y: -1 };
	tail: { x: number, y: number } = { x: -1, y: -1 };
	constructor(origin: { x: number, y: number }, public color: ColorName) {
		this.head = this.tail = origin;
	}
	append(x: number, y: number): void {
		throw new Error('Method not implemented.');
	}
}

export { Trail }
