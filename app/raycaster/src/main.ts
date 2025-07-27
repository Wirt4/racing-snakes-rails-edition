import { Settings } from './settings/settings';
import { bootstrap } from './bootstrap/bootstrap';

const settings = new Settings();

bootstrap({
	canvasId: "game-window",
	workerPath: "/workers/worker.js",
	settings,
});

