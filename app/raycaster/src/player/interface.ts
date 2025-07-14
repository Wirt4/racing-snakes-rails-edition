import { ColorName } from '../game/color/color_name';
import { LineSegment } from '../geometry/interfaces';
export interface PlayerInterface {
	rotate: (angle: number) => void;
	x: number;
	y: number;
	move: () => void;
	trail: LineSegment[];
	angle: number;
	color: ColorName;
}
