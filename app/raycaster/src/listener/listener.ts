import { Directions } from '../controls/directions';

const type = "turn";

class Listener {
	private buttonPressed: boolean = false;
	constructor(private worker: Worker) { }

	keydown(keystroke: string): void {
		if (!this.buttonPressed) {
			this.worker.postMessage({ type, direction: Directions.LEFT });
		}
		this.buttonPressed = true;
	}
}

export { Listener }
