import { Player } from './player';
import { Wall } from './wall';
import { RendererInterface } from './renderer';
import { Settings } from './settings';
import { Angle } from './angle';
import { Color } from './color';
import { Point } from './point';

class GameMap {
	player: Player
	walls: Wall[]
	constructor(player: Player, walls: Wall[]) {
		this.player = player;
		this.walls = walls;
	}

	draw(renderer: RendererInterface): void {
		for (let i = 0; i < Settings.RESOLUTION; i++) {
			// getting the ray angle is  a private method to this class
			const angle = this.getRayAngle(i);
			const { distance, color } = this.castRay(angle);
			const correctedDistance = this.removeFishEye(distance, angle, this.player.angle)
			const sliceHeight = this.calculateSliceHeight(correctedDistance, Settings.CANVAS_HEIGHT);
			const brightness = this.calculateBrightness(correctedDistance);
			renderer.fillColor(color, brightness);
			this.renderVerticalSlice(renderer, i, sliceHeight);
		}
		this.draw2DMap(renderer, Angle.fromDegrees(Settings.DEGREES_OF_VISION).radians);
	}

	update(): void {
		// Update game state, e.g., player position, wall states, etc.
		// This method can be expanded based on game logic
		// For now, it does nothing except demonstrate the 3D-ness
		this.player.angle += 0.01;
	}

	private getRayAngle(index: number): number {
		//this conversion is a little wonky, would like to precomput the radians before entering the loop
		return this.player.angle - Angle.fromDegrees(Settings.DEGREES_OF_VISION).radians / 2 + (index / Settings.RESOLUTION) * Angle.fromDegrees(Settings.DEGREES_OF_VISION).radians;
	}

	private castRay(angle: number): { distance: number, color: Color } {
		//this really isn't descriptive the dx/dy bit that's going on
		const rayDirection = { x: Math.cos(angle), y: Math.sin(angle) }
		// This method will cast a ray in the direction of the angle
		// and return the distance to the nearest wall and its color
		let color = Color.NONE;
		let closest = { isValid: false, x: -1, y: -1, distance: Infinity };
		//consider a foreach loop below
		for (const wall of this.walls) {
			const hit = this.rayIntersectsWall(this.player.position, rayDirection, wall);
			if (hit.isValid && (!closest.isValid || hit.distance < closest.distance)) {
				closest = hit
				color = wall.color
			}
		}

		if (closest.isValid) {
			return { distance: closest.distance, color }
		}

		return { distance: Settings.MAX_DISTANCE, color };

	}

	private rayIntersectsWall(rayOrigin: { x: number, y: number }, direction: { x: number, y: number }, wall: Wall): { isValid: boolean, x: number, y: number, distance: number } {
		const { start: wallStart, end: wallEnd } = wall;
		const rayPoint = new Point(rayOrigin.x + direction.x, rayOrigin.y + direction.y);
		const determinant = this.calculateDeterminant(wallStart, wallEnd, rayOrigin, rayPoint);
		if (this.isParallel(determinant)) return { isValid: false, x: -1, y: -1, distance: Infinity }
		const wall_intersection = this.wallIntersection(wallStart, rayOrigin, rayPoint, determinant);

		const ray_intersection = this.rayIntersection(wallStart, wallEnd, rayOrigin, determinant);

		if (!this.isInsideWall(wall_intersection, ray_intersection)) return { isValid: false, x: -1, y: -1, distance: Infinity };

		const intersectionX = wallStart.x + wall_intersection * (wallEnd.x - wallStart.x);
		const intersectionY = wallStart.y + wall_intersection * (wallEnd.y - wallStart.y);
		const distance = this.dist(rayOrigin.x, rayOrigin.y, intersectionX, intersectionY);
		return { isValid: true, x: intersectionX, y: intersectionY, distance };
	}

	private calculateDeterminant(wallStart: Point, wallEnd: Point, rayOrigin: { x: number, y: number }, rayPoint: Point): number {
		return (wallStart.x - wallEnd.x) * (rayOrigin.y - rayPoint.y) - (wallStart.y - wallEnd.y) * (rayOrigin.x - rayPoint.x);
	}

	private isParallel(determinant: number): boolean {
		const threshold = 0.00001;
		return Math.abs(determinant) < threshold;
	}

	private wallIntersection(wallStart: Point, rayOrigin: { x: number, y: number }, rayPoint: Point, determinant: number): number {
		const foo = (wallStart.x - rayOrigin.x) * (rayOrigin.y - rayPoint.y)
		const bar = (wallStart.y - rayOrigin.y) * (rayOrigin.x - rayPoint.x)
		const diff = foo - bar
		return diff / determinant;
	}

	private rayIntersection(wallStart: Point, wallEnd: Point, rayOrigin: { x: number, y: number }, determinant: number): number {
		const foo = (wallStart.x - wallEnd.x) * (wallStart.y - rayOrigin.y)
		const bar = (wallStart.y - wallEnd.y) * (wallStart.x - rayOrigin.x)
		const diff = -(foo - bar);
		return diff / determinant;
	}

	private isInsideWall(wall_intersection: number, ray_intersection: number): boolean {
		return wall_intersection >= 0 && wall_intersection <= 1 && ray_intersection >= 0;
	}

	private dist(x1: number, y1: number, x2: number, y2: number): number {
		//hacky pythagorean distance formula
		return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
	}
	// the viewer's angle is an unnecessary parameter
	private removeFishEye(distance: number, angle: number, viewerAngle: number): number {
		return distance * Math.cos(angle - viewerAngle);
	}

	private calculateSliceHeight(distance: number, height: number): number {
		if (distance <= 0) {
			return 2 * height; // Avoid division by zero
		}
		return height / distance;
	}

	private calculateBrightness(distance: number): number {
		return Math.max(Settings.MIN_PERCENT_BRIGHTNESS, Settings.MAX_PERCENT_BRIGHTNESS - distance * Settings.FADE_DISTANCE);
	}

	private renderVerticalSlice(renderer: RendererInterface, fieldOfVisionXCoord: number, sliceHeight: number): void {
		renderer.rect(fieldOfVisionXCoord, Settings.CANVAS_HEIGHT / 2 - sliceHeight / 2, 1, sliceHeight);

	}

	private draw2DMap(renderer: RendererInterface, angle: number): void {
		// This method can be used to draw a 2D map of the game world
		renderer.save();
		renderer.scale(10);
		renderer.stroke(Color.WHITE);
		for (const wall of this.walls) {
			wall.draw2D(renderer);
		}
		this.player.draw2D(renderer);
		//for debugging
		this.drawRays(renderer);

		renderer.restore();

	}

	private drawRays(renderer: RendererInterface): void {
		renderer.stroke(Color.GREEN);
		renderer.strokeWeight(0.05);
		const resolution = 20
		for (let i = 0; i < Settings.CANVAS_WIDTH; i += resolution) {
			const rayAngle = this.getRayAngle(i);
			const { distance } = this.castRay(rayAngle);
			const hit = this.player.position.nextLocation(rayAngle, distance);
			renderer.line(this.player.position.x, this.player.position.y, hit.x, hit.y);
		}
	}
}
export { GameMap };
