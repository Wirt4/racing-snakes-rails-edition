import { GameMapInterface, WallInterface } from './interface';
import { Coordinates, LineSegment, Dimensions } from '../geometry/interfaces';
import { ColorName } from '../game/color/color_name';
import { PlayerInterface } from '../player/interface';
import { Slice } from '../gamemap/interface';
import { assertIsPositive } from '../utils';
interface Intersection {
	isValid: boolean;
	x: number;
	y: number;
	distance: number;
}
export class GameMap implements GameMapInterface {
	walls: WallInterface[] = [];
	gridLinesX: LineSegment[] = [];
	gridLinesY: LineSegment[] = [];
	player: PlayerInterface


	constructor(
		size: Dimensions,
		boundaryColor: ColorName = ColorName.BLACK,
		gridCell: number = 2,
		player: PlayerInterface
	) {
		if (!(this.isInRange(player.position.x, size.width) && this.isInRange(player.position.y, size.height))) {
			throw new Error("Player position is outside the map boundaries");
		}
		this.player = player
		this.gridLinesY = this.generateGridLines(gridCell, size.height, size.width, true);
		this.gridLinesX = this.generateGridLines(gridCell, size.width, size.height, false);
		const left_top = { x: 0, y: 0 };
		const left_bottom = { x: 0, y: size.height };
		const right_top = { x: size.width, y: 0 };
		const right_bottom = { x: size.width, y: size.height };

		this.walls = [
			this.initializeWall(left_top, left_bottom, boundaryColor),
			this.initializeWall(left_top, right_top, boundaryColor),
			this.initializeWall(right_top, right_bottom, boundaryColor),
			this.initializeWall(left_bottom, right_bottom, boundaryColor),
		];
	}

	get playerPosition(): Coordinates {
		return this.player.position;
	}

	get playerAngle(): number {
		return this.player.angle;
	}

	appendWall(wall: WallInterface): void {
		this.walls.push(wall);
	}

	movePlayer(): void {
		this.player.move();
	}

	turnPlayer(angle: number): void {
		this.player.rotate(angle)
	}

	castRay(angle: number, maximumAllowableDistance: number): Slice {
		const rayDirection = {
			x: Math.cos(angle),
			y: Math.sin(angle)
		};

		let closest: Intersection = {
			isValid: false,
			x: -1,
			y: -1,
			distance: maximumAllowableDistance
		};
		let color = ColorName.NONE;

		for (const wall of this.walls) {
			const hit = this.rayIntersectsWall(this.playerPosition, rayDirection, wall);
			if (hit.isValid && hit.distance < closest.distance) {
				closest = hit;
				color = wall.color;
			}
		}

		const maxDistance = closest.isValid ? closest.distance : maximumAllowableDistance;
		//TODO: law of demeter
		const rayEnd = {
			x: this.player.position.x + rayDirection.x * maxDistance,
			y: this.player.position.y + rayDirection.y * maxDistance
		};

		const gridHits: number[] = [];

		for (const grid of [...this.gridLinesX, ...this.gridLinesY]) {
			const hit = this.rayIntersectsWall(this.player.position, rayDirection, {
				line: grid,
				color: ColorName.BLUE
			});
			if (hit.isValid && hit.distance < maxDistance) {
				gridHits.push(hit.distance);
			}
		}

		return {
			distance: closest.distance,
			color,
			gridHits,
			intersection: rayEnd
		};
	}
	private rayIntersection(wallStart: Coordinates, wallEnd: Coordinates, rayOrigin: Coordinates, determinant: number): number {
		const numerator1 = (wallStart.x - wallEnd.x) * (wallStart.y - rayOrigin.y)
		const numerator2 = (wallStart.y - wallEnd.y) * (wallStart.x - rayOrigin.x)
		const diff = -(numerator1 - numerator2);
		return diff / determinant;
	}

	private isInsideWall(wall_intersection: number, ray_intersection: number): boolean {
		return wall_intersection >= 0 && wall_intersection <= 1 && ray_intersection >= 0;
	}

	private dist(coordinatesA: Coordinates, coordinatesB: Coordinates): number {
		return Math.sqrt((coordinatesB.x - coordinatesA.x) ** 2 + (coordinatesB.y - coordinatesA.y) ** 2);
	}

	private rayIntersectsWall(rayOrigin: Coordinates, direction: Coordinates, wall: WallInterface): Intersection {
		const { start: wallStart, end: wallEnd } = wall.line;
		const rayPoint: Coordinates = { x: rayOrigin.x + direction.x, y: rayOrigin.y + direction.y };
		const determinant = this.calculateDeterminant(wallStart, wallEnd, rayOrigin, rayPoint);
		const result = { isValid: false, x: -1, y: -1, distance: Infinity };

		if (this.isParallel(determinant)) {
			return result;
		}

		const wall_intersection = this.wallIntersection(wallStart, rayOrigin, rayPoint, determinant);
		const ray_intersection = this.rayIntersection(wallStart, wallEnd, rayOrigin, determinant);
		if (!this.isInsideWall(wall_intersection, ray_intersection)) {
			return result;
		}

		result.isValid = true;
		result.x = wallStart.x + wall_intersection * (wallEnd.x - wallStart.x);
		result.y = wallStart.y + wall_intersection * (wallEnd.y - wallStart.y);
		result.distance = this.dist(rayOrigin, result);
		return result;
	}

	private wallIntersection(wallStart: Coordinates, rayOrigin: Coordinates, rayPoint: Coordinates, determinant: number): number {
		const numerator1 = (wallStart.x - rayOrigin.x) * (rayOrigin.y - rayPoint.y)
		const numerator2 = (wallStart.y - rayOrigin.y) * (rayOrigin.x - rayPoint.x)
		const diff = numerator1 - numerator2;
		return diff / determinant;
	}

	private calculateDeterminant(wallStart: Coordinates, wallEnd: Coordinates, rayOrigin: Coordinates, rayPoint: Coordinates): number {
		return (wallStart.x - wallEnd.x) * (rayOrigin.y - rayPoint.y) - (wallStart.y - wallEnd.y) * (rayOrigin.x - rayPoint.x);
	}

	private isParallel(determinant: number): boolean {
		return Math.abs(determinant) < 1e-5;
	}

	private initializeWall(start: Coordinates, end: Coordinates, color: ColorName): WallInterface {
		return {
			line: { start, end },
			color
		}
	}

	private generateGridLines(step: number, primary: number, secondary: number, isVerical: boolean = false): LineSegment[] {
		const lines: LineSegment[] = [];
		for (let i = step; i <= primary; i += step) {
			if (isVerical) {
				lines.push({
					start: { x: i, y: 0 },
					end: { x: i, y: secondary }
				});
			} else {
				lines.push({
					start: { x: 0, y: i },
					end: { x: secondary, y: i }
				});
			}
		}
		return lines;
	}

	private isInRange(value: number, limit: number): boolean {
		return value < limit && value > 0
	}

}
