import { build } from 'esbuild';

const commonOptions = {
	bundle: true,
	format: 'esm',
	target: 'es2020',
	sourcemap: true,
};

const buildMain = () =>
	build({
		entryPoints: ['src/main.ts'],
		outfile: '../assets/builds/raycaster.js',
		...commonOptions,
	});

const buildWorker = () =>
	build({
		entryPoints: ['src/worker/worker.ts'],
		outfile: '../../public/workers/worker.js',
		...commonOptions,
	});

const buildAll = async () => {
	await buildMain();
	await buildWorker();
};

const [, , task] = process.argv;

switch (task) {
	case 'main':
		buildMain();
		break;
	case 'worker':
		buildWorker();
		break;
	case 'all':
		buildAll();
		break;
	default:
		console.error(`Unknown task: ${task}`);
}

