require('esbuild')
	.build({
		entryPoints: ['./src/main.ts'],
		bundle: true,
		outfile: '../assets/builds/raycaster.js',
		format: 'esm',
		target: 'es2020',
		sourcemap: true,

	})
	.then(() => { console.log('build success') })
	.catch(e => { console.error(e); process.exit(1); });


