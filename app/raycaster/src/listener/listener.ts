import { Directions } from '../controls/directions';

const type = "turn";

class Listener {
	private buttonPressed: boolean = false;
	constructor(private worker: Worker) { }

	keydown(keystroke: string): void {
		const direction = keystroke === "ArrowLeft" ? Directions.LEFT : Directions.RIGHT;
		if (!this.buttonPressed) {
			this.worker.postMessage({ type, direction });
		}
		this.buttonPressed = true;
	}
}

export { Listener }
