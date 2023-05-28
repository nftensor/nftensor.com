module.exports = {
    mode: "jit",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                blue: "#0E76FD",
             },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
