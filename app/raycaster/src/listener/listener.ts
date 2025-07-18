import { Directions } from '../controls/directions';
class Listener {
	constructor(private worker: Worker) { }

	keydown(keystroke: string): void {

		this.worker.postMessage({ type: "turn", direction: "LEFT" });
	}
}

export { Listener }
