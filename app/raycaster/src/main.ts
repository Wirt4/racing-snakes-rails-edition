import { Settings } from './settings/settings';
import { bootstrap } from './bootstrap/bootstrap';
import { listenerFactory } from './listener/factory';

bootstrap({
	canvasId: "game-window",
	workerPath: "/workers/worker.js",
	settings: new Settings(),
	listenerFactory
});

