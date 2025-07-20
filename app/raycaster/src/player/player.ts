import { PlayerInterface } from './interface';
import { ColorName } from '../color/color_name';
import { Coordinates } from '../geometry/interfaces';
import { BMath } from '../boundedMath/bmath';
import { CameraInterface } from '../camera/interface';
import { Directions } from '../controls/directions';
import { TrailInterface } from '../trail/interface';

class Player implements PlayerInterface {
	x: number;
	y: number;
	private currentHeading: number;
	private lastPosition: Coordinates = { x: 0, y: 0 };
	public color: ColorName;
	private bMath: BMath = BMath.getInstance();
	private isTurning: boolean = false;

	constructor(
		coordinates: Coordinates,
		private speed: number,
		color: ColorName = ColorName.RED,
		private camera: CameraInterface,
		public trail: TrailInterface
	) {
		this.x = coordinates.x;
		this.y = coordinates.y;
		this.currentHeading = camera.angle;
		this.lastPosition = { x: this.x, y: this.y };
		const startWall = { line: { start: this.lastPosition, end: this.lastPosition }, color };
		this.color = color;
	}

	get angle(): number {
		return this.camera.angle;
	}

	turnLeft(): void {
		this.turn(Directions.LEFT);
	}

	turnRight(): void {
		this.turn(Directions.RIGHT);
	}

	move(): void {
		this.adjustCamera();
		this.redirectIfTurned();
		this.moveAlongHeading();
	}

	private turn(dir: Directions): void {
		if (!this.isTurning) {
			this.camera.beginTurnExecution(dir);
			this.isTurning = true;
		}
	}

	private redirectIfTurned(): void {
		if (this.cameraTurnHasCompleted() && this.isTurning) {
			this.redirect();
			this.isTurning = false;
		}
	}

	private redirect(): void {
		this.trail.append(this.x, this.y);
		this.currentHeading = this.camera.angle;
	}

	private adjustCamera(): void {
		if (this.camera.isRotating) {
			this.camera.adjust();
		}
	}

	private cameraTurnHasCompleted(): boolean {
		return !this.camera.isRotating;
	}

	private growTrail(): void {
		Object.assign(this.trail.head, { x: this.x, y: this.y });
	}

	private moveAlongHeading(): void {
		this.x += Math.round(this.bMath.cos(this.currentHeading)) * this.speed;
		this.y += this.bMath.sin(this.currentHeading) * this.speed;
		this.growTrail();
	}
}

export { Player };
