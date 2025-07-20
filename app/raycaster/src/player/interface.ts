import { ColorName } from '../color/color_name';
import { TrailInterface } from '../trail/interface';
import { WallInterface } from '../gamemap/interface';

export interface PlayerInterface {
	turnLeft: () => void;
	turnRight: () => void;
	x: number;
	y: number;
	move: () => void;
	trail: TrailInterface;
	angle: number;
	color: ColorName;
	temp: WallInterface[];
}
