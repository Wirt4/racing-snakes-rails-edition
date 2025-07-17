// scripts/build-all.mjs
import { build } from 'esbuild';

// Define options for both builds (no watch mode here, this is a one-time full build)
const commonOpts = { bundle: true, format: 'esm', target: 'es2020', sourcemap: true };
const mainOpts = { ...commonOpts, entryPoints: ['src/main.ts'], outfile: '../assets/builds/raycaster.js' };
const workerOpts = { ...commonOpts, entryPoints: ['src/worker/worker.ts'], outfile: '../../public/workers/worker.js' };

try {
	await build(mainOpts);
	await build(workerOpts);
	console.log('✅ Both main and worker bundles built successfully');
} catch (err) {
	console.error('❌ Build failed:', err);
	process.exit(1);
}

