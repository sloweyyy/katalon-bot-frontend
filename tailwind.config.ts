import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class",
	theme: {
		container: {
			center: true,
			padding: "1rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			animation: {
				bounce: "bounce 1s infinite",
			},
			keyframes: {
				bounce: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-20%)" },
				},
			},
		},
	},
	plugins: [],
};

export default config;
