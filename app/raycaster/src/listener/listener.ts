import { Directions } from '../controls/directions';
class Listener {
	private buttonPressed: boolean = false;
	constructor(private worker: Worker) { }

	keydown(keystroke: string): void {
		if (!this.buttonPressed) {
			this.worker.postMessage({ type: "turn", direction: Directions.LEFT });
		}
		this.buttonPressed = true;
	}
}

export { Listener }
