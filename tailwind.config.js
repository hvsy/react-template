const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
    content: [ './src/**/*.{ts,tsx,js,jsx}' ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
};
