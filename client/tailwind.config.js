/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "tw-",
  important: true,
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
    screens: {
      lg: "992px",
    },
    colors: {
      primary: "#EA4747",
      secondary: "#706C61",
      text: "#F4F1BB",
      background: "#2A2B2A",
      error: "#dc3545",
      errorBackground: "#FF7D7D55",
      col1: "#778DA9",
      col2: "#7C9299",
      col3: "#91A6FF",
    },
  },
  plugins: [],
};
