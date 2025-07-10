import { RendererInterface } from '../renderer/renderer';
import { WallInterface, GameMapInterface } from '../gamemap/interface';
import { RaycasterInterface } from '../raycaster/interface';
import { Settings } from '../settings';
import { ColorName } from './color/color_name';
import { Coordinates } from '../geometry/interfaces';
import { BrightnessInterface } from '../brightness/interface';


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
		this.map.walls.forEach((wall: WallInterface) => {
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
		rays.forEach((angle) => {
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

	private calculateDeterminant(wallStart: Coordinates, wallEnd: Coordinates, rayOrigin: Coordinates, rayPoint: Coordinates): number {
		return (wallStart.x - wallEnd.x) * (rayOrigin.y - rayPoint.y) - (wallStart.y - wallEnd.y) * (rayOrigin.x - rayPoint.x);
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

	private nextLocation(coordinates: Coordinates, angle: number, distance: number): Coordinates {
		return {
			x: coordinates.x + Math.cos(angle) * distance,
			y: coordinates.y + Math.sin(angle) * distance
		};
	}
}
export { Game };
