import { ColorName } from '../color/color_name';
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
// before writing more code, let's list reasons why the implementation
// of each member-method would change
//two responsibilities here: positioning and controls
