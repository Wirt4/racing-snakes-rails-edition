import { ColorName } from '../game/color/color_name';
import { WallInterface } from '../gamemap/interface';
export interface PlayerInterface {
	turnLeft: () => void;
	turnRight: () => void;
	x: number;
	y: number;
	move: () => void;
	trail: WallInterface[];
	angle: number;
	color: ColorName;
}
