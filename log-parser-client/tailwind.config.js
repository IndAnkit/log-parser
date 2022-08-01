/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#171821",
				secondary: "#21222D",
				white: "#fff",
				"light-gray": "#A0A0A0",
				"dark-gray": "#87888C",
				"light-green": "#A9DFD8",
				yellow: "#FEB95A",
				"yellow-dark": "##FCB859",
				blue: "#28AEF3",
				pink: "#F2C8ED",
			},
			fontSize: {
				xss: ["10px", "12px"],
			},
		},
  },
  
	plugins: [],
};
