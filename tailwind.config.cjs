/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,svelte,js,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui'), require('@tailwindcss/line-clamp')],
	daisyui: {
		themes: ['dark']
	}
}
