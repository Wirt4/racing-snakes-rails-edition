module.exports = {
	content: [
		'./app/views/**/*.{html,erb}',
		'./app/helpers/**/*.rb',
		'./app/assets/stylesheets/**/*.css',
		'./app/javascript/**/*.js'
	],
	theme: {
		extend: {
			dropShadow: {
				neon: ['0 0 5px #f0f', '0 0 10px #f0f'],
			},
			fontFamily: {
				arcade: ['"Press Start 2P"', 'monospace'],
			},
		},
	},
	plugins: [],
}

