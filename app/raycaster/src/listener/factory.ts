import { Listener, ListenerInterface } from './listener';
import { KeyMap } from '../controls/keymap/keymap';
import { DirectionMessenger } from '../directionMessenger/directionMessenger';

function listenerFactory(worker: Worker): ListenerInterface {
	const keyMap = new KeyMap(['ArrowLeft', 'ArrowRight']);
	const directionMessenger = new DirectionMessenger(worker);
	return new Listener(keyMap, directionMessenger);
}

export { listenerFactory };
