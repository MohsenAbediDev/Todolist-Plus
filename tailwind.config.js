// tailwind.config.ts
const config = {
	darkMode: 'class',
	content: ['./index.html', './ts/**/*.ts'],
	theme: {
		extend: {
			colors: {
				primary: 'var(--primary-color)',
			},
		},
	},
	plugins: [],
}
export default config
