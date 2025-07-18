import { build } from 'esbuild';
import { buildEs } from './build-es.mjs';

const watchMode = process.argv.includes('--watch');
try {
	await buildEs('src/worker/worker.ts', '../../public/workers/worker.js', watchMode)
} catch (err) {
	console.error('Error in build-worker.mjs:', err);
	if (!watchMode) {
		console.error('Exiting due to error in build-worker.mjs');
		process.exit(1);
	}
}
