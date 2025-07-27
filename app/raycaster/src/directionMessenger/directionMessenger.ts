import { DirectionMessengerInterface } from './interface'
import { Directions } from '../controls/directions';

class DirectionMessenger implements DirectionMessengerInterface {
	constructor(private worker: Worker) { }

	sendTurn(direction: Directions): void {
		this.worker.postMessage({ type: 'turn', direction });
	}
}

export { DirectionMessenger };
