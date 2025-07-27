import { Settings } from './settings/settings';
import { bootstrap } from './bootstrap/bootstrap';
import { Listener } from './listener/listener';
const settings = new Settings();

const listenerFactory = (worker: Worker) => new Listener(worker);

bootstrap({
	canvasId: "game-window",
	workerPath: "/workers/worker.js",
	settings,
	listenerFactory
});

