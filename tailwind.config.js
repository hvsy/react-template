const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
    content: [ './src/**/*.{ts,tsx,js,jsx}' ],
    theme: {
        screens : {
            'xxl': {'max': '1600px'},
            // => @media (max-width: 1535px) { ... }

            'xl': {'max': '1200px'},
            // => @media (max-width: 1279px) { ... }

            'lg': {'max': '992px'},
            // => @media (max-width: 1023px) { ... }

            'md': {'max': '768px'},
            // => @media (max-width: 767px) { ... }

            'sm': {'max': '576px'},
            'xs': {'max': '480px'},
            // => @media (max-width: 639px) { ... }
        },
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [
    ],
};
