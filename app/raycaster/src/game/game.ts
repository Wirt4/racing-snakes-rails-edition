import { RendererInterface } from '../renderer/renderer';
import { GameMapInterface } from '../gamemap/interface';
import { RaycasterInterface } from '../raycaster/interface';
import { Settings } from '../settings';
import { ColorName } from './color/color_name';
import { Coordinates, LineSegment } from '../geometry/interfaces';
import { BrightnessInterface } from '../brightness/interface';
import { Batches } from './batches'

type BatchedRect = { x: number, y: number, width: number, height: number };

class Game {
	fieldOfVision: number = Settings.FIELD_OF_VISION;
	map: GameMapInterface;

	private static readonly HORIZON_Y = Settings.HORIZON_LINE_RATIO * Settings.CANVAS_HEIGHT;
	constructor(map: GameMapInterface) {
		this.map = map;
	}

	draw(renderer: RendererInterface, raycaster: RaycasterInterface, brightness: BrightnessInterface, HUD: boolean = false): void {
		/**Precondition: Renderer, Raycaster, and Brightness interfaces must be implemented
		 * Postcondition: The game will render a 3D view of the map with walls, floor, and player position
		 * if HUD is true, then a map overlay will be drawn as well
		 * */
		this.drawBackround(renderer);
		const rays = raycaster.getViewRays(this.map.playerAngle);
		// Calculate the focal length based on the field of vision
		const gridBatch: Array<BatchedRect> = []
		const batches = new Batches()

		rays.forEach((angle, i) => {
			const { distance, color, gridHits } = this.map.castRay(angle, Settings.MAX_DISTANCE);
			const correctedDistance = raycaster.removeFishEye(distance, angle, this.map.playerAngle);
			// Project top and bottom of the wall slice
			const wallTopOffset = Settings.WALL_HEIGHT - Settings.CAMERA_HEIGHT;
			const wallBottomOffset = -Settings.CAMERA_HEIGHT;
			const topY = Game.HORIZON_Y - (wallTopOffset * raycaster.focalLength) / correctedDistance;
			const bottomY = Game.HORIZON_Y - (wallBottomOffset * raycaster.focalLength) / correctedDistance;
			const sliceHeight = this.sliceHeight(correctedDistance, raycaster.focalLength);

			// Draw the wall slice
			const wallBrightness = brightness.calculateBrightness(correctedDistance);
			//batch the walls
			batches.addWallSlice(color, wallBrightness, { x: i, y: topY }, sliceHeight)
			// Draw floor grid hits
			renderer.fillColor(ColorName.BLUE, 50);

			for (const hit of gridHits) {
				const correctedGridDistance = raycaster.removeFishEye(hit, angle, this.map.playerAngle);
				const floorOffset = -Settings.CAMERA_HEIGHT;
				const projectedFloorY = Game.HORIZON_Y - (floorOffset * raycaster.focalLength) / correctedGridDistance;
				//gridBatch.push({ x: i, y: projectedFloorY, width: 1, height: 1 });
				batches.addGridPoint({ x: i, y: projectedFloorY });
			}
		});
		// Draw batched walls
		for (const [key, rects] of Object.entries(batches.wallBatches)) {

			const [colorName, brightness] = key.split("_");
			renderer.fillColor(colorName as ColorName, Number(brightness) / 100);
			rects.forEach(r => {
				renderer.rect({ x: r.x, y: r.y }, r.width, r.height)
			});
		}
		// Draw the floor grid
		renderer.fillColor(ColorName.BLUE, 50);
		batches.gridBatch.forEach(r => renderer.rect({ x: r.x, y: r.y }, r.width, r.height));
		if (!HUD) return;
		// overlay the 2D map
		renderer.save();
		renderer.scale(2.5);

		const hudWallGroups: Record<string, LineSegment[]> = {};
		// key: `${color}_${weight}`

		this.map.walls.forEach((wall) => {
			const key = `${wall.color}_0.5`;
			if (!hudWallGroups[key]) hudWallGroups[key] = [];
			hudWallGroups[key].push(wall.line);
		});
		//batch draw the walls by color
		for (const [key, lines] of Object.entries(hudWallGroups)) {
			const [color, weight] = key.split("_");
			renderer.stroke(color as ColorName);
			renderer.strokeWeight(Number(weight));
			lines.forEach(line => renderer.line(line));
		}

		renderer.stroke(ColorName.WHITE);
		renderer.fillColor(ColorName.RED, 100);
		renderer.noStroke();
		renderer.ellipse(this.map.playerPosition, 0.2);


		this.draw2DRays(renderer, rays);

		renderer.restore();
	}

	private sliceHeight(distance: number, focalLength: number): number {
		const wallTopOffset = Settings.WALL_HEIGHT - Settings.CAMERA_HEIGHT;
		const wallBottomOffset = -Settings.CAMERA_HEIGHT;
		const topY = Game.HORIZON_Y - (wallTopOffset * focalLength) / distance;
		const bottomY = Game.HORIZON_Y - (wallBottomOffset * focalLength) / distance;
		return bottomY - topY;
	}

	private draw2DRays(renderer: RendererInterface, rays: Array<number>): void {
		/** Draws the rays in 2D for debugging purposes
		 * This method can be expanded based on game logic
		 * For now, it does nothing except demonstrate the 3D-ness
		 **/
		renderer.stroke(ColorName.GREEN);
		renderer.strokeWeight(0.05);
		rays.forEach((angle) => {
			const { distance } = this.map.castRay(angle, Settings.MAX_DISTANCE);
			const hit = this.nextLocation(this.map.playerPosition, angle, distance);
			renderer.line({ start: this.map.playerPosition, end: hit });
		})

	}

	private drawBackround(renderer: RendererInterface): void {
		renderer.fillColor(ColorName.BLUE, 0.01);
		renderer.rect({ x: 0, y: 0 }, Settings.CANVAS_WIDTH, Settings.CANVAS_HEIGHT);

	}


	update(): void {
		/** Update game state, e.g., player position, wall states, etc.
		* This method can be expanded based on game logic
		* For now, it does nothing except demonstrate the 3D-ness
		**/
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
