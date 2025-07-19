import { buildEs } from './build-es.mjs';

try {
	await buildEs('src/main.ts', '../assets/builds/raycaster.js');
	await buildEs('src/worker/worker.ts', '../../public/workers/worker.js');
	console.log('✅ Both main and worker bundles built successfully');
} catch (err) {
	console.error('❌ Build failed:', err);
	process.exit(1);
}

