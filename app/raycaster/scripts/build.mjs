import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

const ctx = await esbuild.context({
	entryPoints: ['src/main.ts'],
	outfile: '../assets/builds/raycaster.js',
	bundle: true,
	format: 'esm',
	target: 'es2020',
	sourcemap: true,
});

if (isWatch) {
	await ctx.watch();
	console.log('🟢 Watching main bundle for changes...');
} else {
	await ctx.rebuild();
	await ctx.dispose();
	console.log('✅ Main bundle built');
}

