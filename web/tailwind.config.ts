import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{ts,tsx}", "../assets/**/*.html"],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;
