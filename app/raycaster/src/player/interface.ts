import { ColorName } from '../color/color_name';
import { TrailInterface } from '../trail/interface';

export interface PlayerInterface {
	turnLeft: () => void;
	turnRight: () => void;
	x: number;
	y: number;
	move: () => void;
	trail: TrailInterface;
	angle: number;
	color: ColorName;
}
