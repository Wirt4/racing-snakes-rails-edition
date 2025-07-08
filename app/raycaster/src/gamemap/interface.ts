import { Coordinates } from '../geometry/interfaces';
import { LineSegment } from '../geometry/line_segment';
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
