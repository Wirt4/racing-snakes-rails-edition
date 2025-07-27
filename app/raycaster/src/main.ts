import { Settings } from './settings/settings';
import { bootstrap } from './bootstrap/bootstrap';
import { Listener } from './listener/listener';
import { Directions } from './controls/directions';
import { KeyMapInterface } from './controls/keymap/interface';

const settings = new Settings();
const keyMap: KeyMapInterface = {
	isMappedKey: ((key: string) => key === 'ArrowLeft' || key === 'ArrowRight'),
	toDirection: ((key: string) => {
		if (key === 'ArrowLeft') return Directions.LEFT;
		return Directions.RIGHT;
	})
};

const listenerFactory = (worker: Worker) => new Listener(worker, keyMap);

bootstrap({
	canvasId: "game-window",
	workerPath: "/workers/worker.js",
	settings,
	listenerFactory
});

