import { Coordinates, LineSegment } from '../geometry/interfaces';
import { ColorName } from '../game/color/color_name';

interface WallInterface {
	line: LineSegment;
	color: ColorName
}

interface GameMapInterface {
	walls: WallInterface[];
	gridLinesX: LineSegment[];
	gridLinesY: LineSegment[];
	playerPosition: Coordinates;
	playerAngle: number;
	movePlayer(): void;
	turnPlayer(angle: number): void;
}

export { GameMapInterface, WallInterface };
