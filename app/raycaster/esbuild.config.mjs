// esbuild.config.mjs
import { build } from 'esbuild';

const commonOptions = {
	bundle: true,
	format: 'esm',
	target: 'es2020',
	sourcemap: true
};

const buildMain = async (watch = false) =>
	build({
		entryPoints: ['src/main.ts'],
		outfile: '../assets/builds/raycaster.js',
		watch,
		...commonOptions
	});

const buildWorker = async (watch = false) =>
	build({
		entryPoints: ['src/worker/worker.ts'],
		outfile: '../../public/workers/worker.js',
		watch,
		...commonOptions
	});

const buildAll = async (watch = false) => {
	await buildMain(watch);
	await buildWorker(watch);
};

const [, , task, ...args] = process.argv;
const isWatch = args.includes('--watch');

switch (task) {
	case 'main': await buildMain(isWatch); break;
	case 'worker': await buildWorker(isWatch); break;
	case 'all': await buildAll(isWatch); break;
	default:
		console.error(`Unknown task: ${task}`);
		process.exit(1);
}

