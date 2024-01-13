import defaultTheme from 'tailwindcss/defaultTheme';
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			black: '#000000',
			gray: '#999999',
			yellow: '#F2B32D',
			orange: '#F8461D',
			white: '#FFFFFF'
		},
		fontFamily: {
			sans: ['Nimbus Sans L', ...defaultTheme.fontFamily.sans]
		}
	},
	plugins: []
};
