import { buildEs } from './build-es.mjs'

const isWatch = process.argv.includes('--watch');
await buildEs('src/main.ts', '../assets/builds/raycaster.js', isWatch);
