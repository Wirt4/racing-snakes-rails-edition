import { ColorName } from '../color/color_name';
import { WallInterface } from '../wall/interface';
import { ArenaInterface } from '../arena/interface'

export interface PlayerInterface {
	turnLeft: () => void;
	turnRight: () => void;
	x: number;
	y: number;
	move: () => void;
	trail: WallInterface[];
	angle: number;
	color: ColorName;
	hasCollided: (arena: ArenaInterface) => boolean;
}
