import { ColorName } from '../color/color_name';

interface TrailInterface {
	append(x: number, y: number): void,

	head: TrailSegment
	tail: TrailSegment
	color: ColorName
}

interface TrailSegment {
	x: number;
	y: number;
	next?: TrailSegment;
}

export { TrailInterface, TrailSegment };
