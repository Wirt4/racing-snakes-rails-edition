import { Directions } from '../controls/directions';
import { Listener, ListenerInterface } from './listener';
import { KeyMapInterface } from '../controls/keymap/interface';

function listenerFactory(worker: Worker): ListenerInterface {
	const keyMap: KeyMapInterface = {
		isMappedKey: ((key: string) => key === 'ArrowLeft' || key === 'ArrowRight'),
		toDirection: ((key: string) => {
			if (key === 'ArrowLeft') return Directions.LEFT;
			return Directions.RIGHT;
		})
	};

	return new Listener(worker, keyMap);
}

export { listenerFactory };
