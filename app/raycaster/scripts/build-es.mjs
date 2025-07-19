import * as esbuild from 'esbuild';

class Builder {
	async initContext(entryPoint, outfile) {
		this.context = await esbuild.context({
			entryPoints: [entryPoint],
			outfile,
			bundle: true,
			format: 'esm',
			target: 'es2020',
			sourcemap: true,
		})
	}
}

class SingleBuilder extends Builder {
	async build(entryPoint, outfile) {
		await this.initContext(entryPoint, outfile);
		await this.context.rebuild();
		await this.context.dispose();
		console.log('✅ ES module built successfully');
	}
}

class WatchBuilder extends Builder {
	async build(entryPoint, outfile) {
		await this.initContext(entryPoint, outfile);
		await this.context.watch();
		console.log('🟢 Watching ES module for changes...');
	}
}

export async function buildEs(entryPoint, outfile, isWatch = false) {
	const esBuilder = isWatch ? new WatchBuilder() : new SingleBuilder();
	console.log(`Building ES module from ${entryPoint} to ${outfile}...`);
	await esBuilder.build(entryPoint, outfile);
}
