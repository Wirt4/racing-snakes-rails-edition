// scripts/build-worker.mjs
import { build } from 'esbuild';

const watchMode = process.argv.includes('--watch');
try {
	await build({
		entryPoints: ['src/worker/worker.ts'],
		outfile: '../../public/workers/worker.js',
		bundle: true,
		format: 'esm',
		target: 'es2020',
		sourcemap: true,
		watch: watchMode ? {
			onRebuild(error) {
				if (error) console.error('❌ Worker bundle rebuild failed:', error);
				else console.log('✅ Worker bundle rebuilt');
			}
		} : false
	});
	if (!watchMode) {
		console.log('✅ Worker bundle built successfully');
	} else {
		console.log('🟢 Watching for changes in worker bundle...');
	}
} catch (err) {
	console.error(err);
	if (!watchMode) process.exit(1);
}

