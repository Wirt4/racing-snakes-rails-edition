import { GameMapInterface, WallInterface } from './interface';
import { Coordinates, LineSegment, Dimensions } from '../geometry/interfaces';
import { ColorName } from '../color/color_name';
import { PlayerInterface } from '../player/interface';
import { Slice } from '../gamemap/interface';
import { BMath } from '../boundedMath/bmath';
import { ObjectPool } from '../objectPool/objectPool';

interface Intersection {
	isValid: boolean;
	x: number;
	y: number;
	distance: number;
}

function nullIntersection(): Intersection {
	return { isValid: false, x: -1, y: -1, distance: Infinity };
}

export class GameMap implements GameMapInterface {
	walls: WallInterface[] = [];
	player: PlayerInterface
	gridLinesX: LineSegment[] = [];
	gridLinesY: LineSegment[] = [];
	private gridLines: LineSegment[];
	private intersectionPool: ObjectPool<Intersection> = new ObjectPool<Intersection>(32000, nullIntersection);
	private rayPoint: Coordinates = { x: 0, y: 0 };
	private bMath = BMath.getInstance();
	private _currentSlice: Slice = { distance: 0, color: ColorName.NONE, gridHits: [], intersection: { x: 0, y: 0 } };
	private rayOrigin: Coordinates = { x: 0, y: 0 };

	constructor(
		size: Dimensions,
		boundaryColor: ColorName = ColorName.BLACK,
		gridCell: number,
		player: PlayerInterface
	) {
		if (!(this.isInRange(player.x, size.width) && this.isInRange(player.y, size.height))) {
			throw new Error("Player position is outside the map boundaries");
		}
		this.player = player
		this.gridLinesY = this.generateGridLines(gridCell, size.height, size.width, true);
		this.gridLinesX = this.generateGridLines(gridCell, size.width, size.height, false);
		this.gridLines = [...this.gridLinesX, ...this.gridLinesY];
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

	get playerTrail(): WallInterface[] {
		return this.player.trail
	}

	get playerPosition(): Coordinates {
		const { x, y } = this.player;
		//ton of object creation here -- will need to change this later
		return { x, y };
	}

	get currentSlice(): Slice {
		return this._currentSlice;
	}

	get playerAngle(): number {
		return this.player.angle;
	}
	public resetIntersections(): void {
		this.intersectionPool.clear();
	}

	appendWall(wall: WallInterface): void {
		this.walls.push(wall);
	}

	movePlayer(): void {
		this.player.move();
	}

	turnPlayer(angle: number): void {
		if (angle < 0) {
			this.player.turnRight()
		} else if (angle > 0) {
			this.player.turnLeft()
		}
	}

	castRay(angle: number, maximumAllowableDistance: number): void {
		const rayDirection = this.rayDirecton(angle);
		const closest = this.defaultIntersection(maximumAllowableDistance);
		let color = ColorName.NONE;
		const { x, y } = this.player;
		this.rayOrigin.x = x
		this.rayOrigin.y = y

		for (const wall of this.walls) {
			const hit = this.rayIntersectsWall(this.rayOrigin, rayDirection, wall.line);
			if (hit.isValid && hit.distance < closest.distance) {
				closest.distance = hit.distance;
				closest.x = hit.x;
				closest.y = hit.y;
				color = wall.color;
			}
			this.intersectionPool.release(hit);
		}

		for (let i = 0; i < this.playerTrail.length - 1; i++) {
			const wall = this.playerTrail[i].line;
			const hit = this.rayIntersectsWall(this.rayOrigin, rayDirection, wall);
			if (hit.isValid && hit.distance < closest.distance) {
				closest.x = hit.x;
				closest.y = hit.y;
				closest.distance = hit.distance;
				color = this.player.color;
			}
			this.intersectionPool.release(hit);
		}

		const rayEnd = this.getRayEnd(rayDirection, closest.distance);
		const gridHits = this.getGridHits(this.rayOrigin, rayDirection, closest.distance);

		this._currentSlice.distance = closest.distance;
		this._currentSlice.color = color;
		this._currentSlice.gridHits = gridHits;
		this._currentSlice.intersection = rayEnd;

		this.intersectionPool.release(closest);
	}

	private getGridHits(origin: Coordinates, rayDirection: Coordinates, maxDistance: number): number[] {
		const gridHits: number[] = [];
		for (const grid of this.gridLines) {
			const hit = this.rayIntersectsWall(origin, rayDirection, grid);
			if (hit.isValid && hit.distance < maxDistance) {
				gridHits.push(hit.distance);
			}
			this.intersectionPool.release(hit);
		}
		return gridHits;
	}

	private getRayEnd(rayDirection: Coordinates, distance: number): Coordinates {
		return {
			x: this.player.x + rayDirection.x * distance,
			y: this.player.y + rayDirection.y * distance
		};

	}

	private defaultIntersection(distance: number): Intersection {
		const defaultIntersection = this.intersectionPool.acquire();
		defaultIntersection.isValid = false;
		defaultIntersection.x = -1;
		defaultIntersection.y = -1;
		defaultIntersection.distance = distance;
		return defaultIntersection;

	}
	private rayDirecton(angle: number): Coordinates {
		return {
			x: this.bMath.cos(angle),
			y: this.bMath.sin(angle)
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

	private rayIntersectsWall(rayOrigin: Coordinates, direction: Coordinates, wall: LineSegment): Intersection {
		this.rayPoint.x = rayOrigin.x + direction.x;
		this.rayPoint.y = rayOrigin.y + direction.y;
		const rayPoint = this.rayPoint;
		const determinant = this.calculateDeterminant(wall.start, wall.end, rayOrigin, rayPoint);
		const result = this.intersectionPool.acquire();
		result.isValid = false;

		if (this.isParallel(determinant)) {
			return result;
		}

		const wall_intersection = this.wallIntersection(wall.start, rayOrigin, rayPoint, determinant);
		const ray_intersection = this.rayIntersection(wall.start, wall.end, rayOrigin, determinant);
		if (!this.isInsideWall(wall_intersection, ray_intersection)) {
			return result;
		}

		result.isValid = true;
		result.x = wall.start.x + wall_intersection * (wall.end.x - wall.start.x);
		result.y = wall.start.y + wall_intersection * (wall.end.y - wall.start.y);
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
