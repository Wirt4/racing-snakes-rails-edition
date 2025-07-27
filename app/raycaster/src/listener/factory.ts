import { Directions } from '../controls/directions';
import { Listener, ListenerInterface } from './listener';
import { KeyMapInterface } from '../controls/keymap/interface';
import { DirectionMessengerInterface } from '../directionMessenger/interface';

function listenerFactory(worker: Worker): ListenerInterface {
	const keyMap: KeyMapInterface = {
		isMappedKey: ((key: string) => key === 'ArrowLeft' || key === 'ArrowRight'),
		toDirection: ((key: string) => {
			if (key === 'ArrowLeft') return Directions.LEFT;
			return Directions.RIGHT;
		})
	};
	const directionMessenger: DirectionMessengerInterface = {
		sendTurn: (direction: Directions) => {
			worker.postMessage({ type: 'turn', direction });
		}
	}

	return new Listener(worker, keyMap, directionMessenger);
}

export { listenerFactory };
