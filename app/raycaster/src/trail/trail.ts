import { TrailInterface } from './interface';
import { ColorName } from '../color/color_name';
import { TrailSegment } from './interface';

class Trail implements TrailInterface {
	head: TrailSegment;
	tail: TrailSegment;
	constructor(originX: number, originY: number, public color: ColorName) {
		this.head = { x: originX, y: originY };
		this.tail = { x: originX, y: originY };
	}
	append(x: number, y: number): void {
		throw new Error('Method not implemented.');
	}
}

export { Trail }
