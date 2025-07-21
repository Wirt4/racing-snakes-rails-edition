import { TrailInterface } from './interface';
import { ColorName } from '../color/color_name';
import { TrailSegment } from './interface';

class Trail implements TrailInterface {
	head: { x: number, y: number } = { x: 0, y: 0 };
	tail: TrailSegment = this.head;
	constructor(originX: number, originY: number, public color: ColorName) {
	}
	append(x: number, y: number): void {
		throw new Error('Method not implemented.');
	}
}

export { Trail }
