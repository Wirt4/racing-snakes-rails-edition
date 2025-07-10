import { RendererInterface } from '../renderer/renderer';
import { RaycasterInterface } from '../raycaster/interface';
import { Settings } from '../settings';
import { Angle } from '../geometry/angle';
import { ColorName } from './color/color_name';
import { Point } from '../geometry/point';
import { Coordinates } from '../geometry/interfaces';
import { GameMapInterface, WallInterface } from '../gamemap/interface';
import { BrightnessInterface } from '../brightness/interface';
interface Intersection {
	isValid: boolean;
	x: number;
	y: number;
	distance: number;
}

class Game {
	fieldOfVision: number = Settings.FIELD_OF_VISION;
	map: GameMapInterface;

	private static readonly HORIZON_Y = Settings.HORIZON_LINE_RATIO * Settings.CANVAS_HEIGHT;
	constructor(map: GameMapInterface) {
		this.map = map;
	}


	draw(renderer: RendererInterface, raycaster: RaycasterInterface, brightness: BrightnessInterface): void {
		renderer.fillColor(ColorName.BLACK, 0.01);
		renderer.rect({ x: 0, y: 0 }, Settings.CANVAS_WIDTH, Settings.CANVAS_HEIGHT);

		const rays = raycaster.getViewRays(this.map.playerAngle);

		rays.forEach((angle, i) => {
			const { distance, color, gridHits } = this.map.castRay(angle, Settings.MAX_DISTANCE);
			const correctedDistance = raycaster.removeFishEye(distance, angle, this.map.playerAngle);

			// Project top and bottom of the wall slice
			const wallTopOffset = Settings.WALL_HEIGHT - Settings.CAMERA_HEIGHT;
			const wallBottomOffset = -Settings.CAMERA_HEIGHT;

			const topY = Game.HORIZON_Y - (wallTopOffset * raycaster.focalLength) / correctedDistance;
			const bottomY = Game.HORIZON_Y - (wallBottomOffset * raycaster.focalLength) / correctedDistance;
			const sliceHeight = bottomY - topY;

			// Draw the wall slice
			const wallBrightness = brightness.calculateBrightness(correctedDistance);
			renderer.fillColor(color, wallBrightness);
			renderer.rect({ x: i, y: topY }, 1, sliceHeight);

			// Draw floor grid hits
			for (const hit of gridHits) {
				const correctedGridDistance = raycaster.removeFishEye(hit, angle, this.map.playerAngle);
				const floorOffset = -Settings.CAMERA_HEIGHT;
				const projectedFloorY = Game.HORIZON_Y - (floorOffset * raycaster.focalLength) / correctedGridDistance;

				const gridBrightness = brightness.calculateBrightness(correctedGridDistance);
				renderer.fillColor(ColorName.BLUE, gridBrightness);
				renderer.rect({ x: i, y: projectedFloorY }, 1, 1);
			}
		});
		// overlay the 2D map
		renderer.save();
		renderer.scale(2.5);
		this.map.walls.forEach(wall => {
			renderer.stroke(wall.color);
			renderer.strokeWeight(0.5);
			renderer.line(wall.line);
		})

		renderer.stroke(ColorName.WHITE);
		renderer.fillColor(ColorName.RED, 100);
		renderer.noStroke();
		renderer.ellipse(this.map.playerPosition, 0.2);

		//drawing the rays
		renderer.stroke(ColorName.GREEN);
		renderer.strokeWeight(0.05);
		rays.forEach((angle, i) => {
			const { distance } = this.map.castRay(angle, Settings.MAX_DISTANCE);
			const hit = this.nextLocation(this.map.playerPosition, angle, distance);
			renderer.line({ start: this.map.playerPosition, end: hit });
		})

		renderer.restore();


	}
	update(): void {
		/** Update game state, e.g., player position, wall states, etc.
		* This method can be expanded based on game logic
		* For now, it does nothing except demonstrate the 3D-ness
		**/
		this.map.turnPlayer(0.02);
		this.map.movePlayer();
	}

	private getRayAngle(index: number): number {
		return this.map.playerAngle - this.fieldOfVision / 2 + (index / Settings.RESOLUTION) * this.fieldOfVision;
	}

	private castRay(angle: number): {
		distance: number,
		color: ColorName,
		gridHits: { distance: number, color: ColorName }[],
		hitpoint: Coordinates
	} {
		//floor grid would go here, return the distances of both the wall and the grid lines
		const rayDirection = { x: Math.cos(angle), y: Math.sin(angle) }
		let color = ColorName.NONE;
		let closest = { isValid: false, x: -1, y: -1, distance: Infinity };
		for (const wall of this.map.walls) {
			const hit = this.rayIntersectsWall(this.map.playerPosition, rayDirection, wall);
			if (hit.isValid && (!closest.isValid || hit.distance < closest.distance)) {
				closest = hit
				color = wall.color
			}
		}
		//measure the grid lines
		const maxDistance = closest.isValid ? closest.distance : Settings.MAX_DISTANCE;
		const endX = this.map.playerPosition.x + rayDirection.x * maxDistance;
		const endY = this.map.playerPosition.y + rayDirection.y * maxDistance;
		const rayEnd = { x: endX, y: endY };

		const gridHits: { distance: number, color: ColorName }[] = [];
		for (const grid of this.map.gridLinesX) {
			const hit = this.rayIntersectsWall(this.map.playerPosition, rayDirection, { line: grid, color: ColorName.BLUE });
			if (hit.isValid && hit.distance < maxDistance) {
				gridHits.push({ distance: hit.distance, color: ColorName.BLUE });
			}
		}
		console.log('grid hits detected', gridHits.length);
		for (const grid of this.map.gridLinesY) {
			const hit = this.rayIntersectsWall(this.map.playerPosition, rayDirection, { line: grid, color: ColorName.BLUE });
			if (hit.isValid && hit.distance < maxDistance) {
				gridHits.push({ distance: hit.distance, color: ColorName.BLUE });
			}
		}

		return { distance: closest.isValid ? closest.distance : Settings.MAX_DISTANCE, color, gridHits, hitpoint: rayEnd };

	}

	private rayIntersectsWall(rayOrigin: Coordinates, direction: Coordinates, wall: WallInterface): Intersection {
		const { start: wallStart, end: wallEnd } = wall.line;
		const rayPoint = new Point(rayOrigin.x + direction.x, rayOrigin.y + direction.y);
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

	private calculateDeterminant(wallStart: Coordinates, wallEnd: Coordinates, rayOrigin: Coordinates, rayPoint: Coordinates): number {
		return (wallStart.x - wallEnd.x) * (rayOrigin.y - rayPoint.y) - (wallStart.y - wallEnd.y) * (rayOrigin.x - rayPoint.x);
	}

	private isParallel(determinant: number): boolean {
		const threshold = 0.00001;
		return Math.abs(determinant) < threshold;
	}

	private wallIntersection(wallStart: Coordinates, rayOrigin: Coordinates, rayPoint: Coordinates, determinant: number): number {
		const numerator1 = (wallStart.x - rayOrigin.x) * (rayOrigin.y - rayPoint.y)
		const numerator2 = (wallStart.y - rayOrigin.y) * (rayOrigin.x - rayPoint.x)
		const diff = numerator1 - numerator2;
		return diff / determinant;
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

	private removeFishEye(distance: number, angle: number): number {
		return distance * Math.cos(angle - this.map.playerAngle);
	}

	private calculateSliceHeight(distance: number, height: number): number {
		if (distance <= 0) {
			return 2 * height;
		}
		return height / distance;
	}

	private calculateBrightness(distance: number): number {
		return Math.max(Settings.MIN_PERCENT_BRIGHTNESS, Settings.MAX_PERCENT_BRIGHTNESS - distance * Settings.FADE_DISTANCE);
	}

	private renderVerticalSlice(
		renderer: RendererInterface,
		fieldOfVisionXCoord: number,
		sliceHeight: number,
		gridMarks: Array<number>,
		angle: number,
		raycaster: RaycasterInterface,
		brightness: BrightnessInterface): void {
		const wallY = Game.HORIZON_Y - (sliceHeight * Settings.HORIZON_LINE_RATIO);
		const origin = { x: fieldOfVisionXCoord, y: wallY };
		renderer.rect(origin, 1, sliceHeight);

		//track the grid
		for (const hit of gridMarks) {
			const corrected = this.removeFishEye(hit, angle);
			const floorOffset = 0 - Settings.CAMERA_HEIGHT;
			const projectedFloorY = Game.HORIZON_Y - (floorOffset * raycaster.focalLength) / corrected;

			const luminosity = brightness.calculateBrightness(corrected);
			renderer.fillColor(ColorName.BLUE, luminosity);
			renderer.rect({ x: fieldOfVisionXCoord, y: projectedFloorY }, 1, 1); // 1-pixel line
		}
	}

	private draw2DMap(renderer: RendererInterface): void {
		renderer.save();
		renderer.scale(2.5);
		renderer.stroke(ColorName.WHITE);
		for (const wall of this.map.walls) {
			renderer.stroke(wall.color);
			renderer.strokeWeight(0.1);
			renderer.line(wall.line);
		}
		renderer.fillColor(ColorName.RED, 100);
		renderer.noStroke();
		renderer.ellipse(this.map.playerPosition, 0.2);

		this.drawRays(renderer);
		renderer.restore();
	}

	private drawRays(renderer: RendererInterface): void {
		renderer.stroke(ColorName.GREEN);
		renderer.strokeWeight(0.05);
		const resolution = 20
		for (let i = 0; i < Settings.CANVAS_WIDTH; i += resolution) {
			const rayAngle = this.getRayAngle(i);
			const { distance } = this.castRay(rayAngle);
			const hit = this.nextLocation(this.map.playerPosition, rayAngle, distance);
			renderer.line({ start: this.map.playerPosition, end: hit });
		}
	}

	private nextLocation(coordinates: Coordinates, angle: number, distance: number): Coordinates {
		return {
			x: coordinates.x + Math.cos(angle) * distance,
			y: coordinates.y + Math.sin(angle) * distance
		};
	}
}
export { Game };
