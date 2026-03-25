/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./public/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
    // 避免 Tailwind preflight 影响现有样式/Element Plus
    corePlugins: {
        preflight: false,
    },
};

