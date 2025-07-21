import { TrailInterface } from './interface';
import { ColorName } from '../color/color_name';

class Trail implements TrailInterface {
	head: { x: number, y: number } = { x: 0, y: 0 };
	tail: { x: number, y: number } = { x: 0, y: 0 };
	constructor(originX: number, originY: number, public color: ColorName) {
	}
	append(x: number, y: number): void {
		throw new Error('Method not implemented.');
	}
}

export { Trail }
