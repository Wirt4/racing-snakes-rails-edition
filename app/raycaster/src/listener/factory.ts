import { Directions } from '../controls/directions';
import { Listener, ListenerInterface } from './listener';
import { KeyMap } from '../controls/keymap/keymap';
import { DirectionMessengerInterface } from '../directionMessenger/interface';

function listenerFactory(worker: Worker): ListenerInterface {
	const keyMap = new KeyMap(['ArrowLeft', 'ArrowRight']);
	const directionMessenger: DirectionMessengerInterface = {
		sendTurn: (direction: Directions) => {
			worker.postMessage({ type: 'turn', direction });
		}
	}

	return new Listener(keyMap, directionMessenger);
}

export { listenerFactory };
