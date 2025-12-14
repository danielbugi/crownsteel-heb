// import type { Config } from 'tailwindcss';
// import tailwindcssAnimate from 'tailwindcss-animate';

// const config: Config = {
//   content: [
//     './pages/**/*.{ts,tsx}',
//     './components/**/*.{ts,tsx}',
//     './app/**/*.{ts,tsx}',
//     './src/**/*.{ts,tsx}',
//   ],
//   prefix: '',
//   theme: {
//     container: {
//       center: true,
//       padding: '2rem',
//       screens: {
//         '2xl': '1400px',
//       },
//     },
//     extend: {
//       fontFamily: {
//         sans: [
//           '"Rubik"',
//           'system-ui',
//           'sans-serif',
//           'var(--font-rubik)',
//           'var(--font-heebo)',
//         ],
//         serif: ['var(--font-playfair)', 'serif'],
//         hebrew: ['var(--font-heebo)', 'sans-serif'],
//         bbh: ['"Rubik"', 'system-ui', 'sans-serif'],
//       },
//       colors: {
//         border: 'hsl(var(--border))',
//         input: 'hsl(var(--input))',
//         ring: 'hsl(var(--ring))',
//         background: 'hsl(var(--background))',
//         foreground: 'hsl(var(--foreground))',
//         primary: {
//           DEFAULT: 'hsl(var(--primary))',
//           foreground: 'hsl(var(--primary-foreground))',
//         },
//         secondary: {
//           DEFAULT: 'hsl(var(--secondary))',
//           foreground: 'hsl(var(--secondary-foreground))',
//         },
//         destructive: {
//           DEFAULT: 'hsl(var(--destructive))',
//           foreground: 'hsl(var(--destructive-foreground))',
//         },
//         muted: {
//           DEFAULT: 'hsl(var(--muted))',
//           foreground: 'hsl(var(--muted-foreground))',
//         },
//         accent: {
//           DEFAULT: 'hsl(var(--accent))',
//           foreground: 'hsl(var(--accent-foreground))',
//         },
//         popover: {
//           DEFAULT: 'hsl(var(--popover))',
//           foreground: 'hsl(var(--popover-foreground))',
//         },
//         card: {
//           DEFAULT: 'hsl(var(--card))',
//           foreground: 'hsl(var(--card-foreground))',
//         },
//         gold: {
//           50: '#fdfcf7',
//           100: '#faf8ed',
//           200: '#f5f0d9',
//           300: '#ede4b8',
//           400: '#e4d495',
//           500: '#d4a574',
//           600: '#c48e5c',
//           700: '#a8754a',
//           800: '#8a5f3e',
//           900: '#6f4e34',
//         },
//       },
//       borderRadius: {
//         lg: 'var(--radius)',
//         md: 'calc(var(--radius) - 2px)',
//         sm: 'calc(var(--radius) - 4px)',
//       },
//       keyframes: {
//         'accordion-down': {
//           from: { height: '0' },
//           to: { height: 'var(--radix-accordion-content-height)' },
//         },
//         'accordion-up': {
//           from: { height: 'var(--radix-accordion-content-height)' },
//           to: { height: '0' },
//         },
//       },
//       animation: {
//         'accordion-down': 'accordion-down 0.2s ease-out',
//         'accordion-up': 'accordion-up 0.2s ease-out',
//       },
//     },
//   },
//   plugins: [tailwindcssAnimate],
// };

// export default config;
// tailwind.config.ts - Enhanced with RTL Support
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Font families
      fontFamily: {
        sans: ['var(--font-figtree)', 'sans-serif'],
        figtree: ['var(--font-figtree)', 'sans-serif'],
        cinzel: ['var(--font-cinzel)', 'serif'],
        playfair: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        // Masculine Energy Color Palette
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // Masculine Energy Colors
        'black-pure': '#000000',
        'black-soft': '#111111',
        'black-rich': '#1A1A1A',
        'gold-elegant': '#C5A253',
        'white-pure': '#FFFFFF',
        gold: {
          50: '#fdfcf7',
          100: '#faf8ed',
          200: '#f5f0d9',
          300: '#ede4b8',
          400: '#e4d495',
          500: '#C5A253', // Elegant gold
          600: '#c48e5c',
          700: '#a8754a',
          800: '#8a5f3e',
          900: '#6f4e34',
          950: '#3d2818',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
            opacity: '1',
          },
          to: { height: '0', opacity: '0' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'announce-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0%)', opacity: '1' },
        },
        'announce-out': {
          '0%': { transform: 'translateX(0%)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.3s ease-in-out',
        'accordion-up': 'accordion-up 0.3s ease-in-out',
        'slide-left': 'slide-left 4s infinite linear',
        marquee: 'marquee 20s infinite linear',
        'announce-in': 'announce-in 0.7s ease-out forwards',
        'announce-out': 'announce-out 0.7s ease-in forwards',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // RTL Plugin
    function ({ addUtilities, addVariant }: any) {
      // Add RTL-specific utilities
      addUtilities({
        '.rtl': {
          direction: 'rtl',
        },
        '.ltr': {
          direction: 'ltr',
        },
      });

      // Add RTL variant
      addVariant('rtl', '[dir="rtl"] &');
      addVariant('ltr', '[dir="ltr"] &');

      // Logical property utilities (better RTL support)
      addUtilities({
        // Margin inline
        '.ms-auto': { 'margin-inline-start': 'auto' },
        '.me-auto': { 'margin-inline-end': 'auto' },
        '.ms-0': { 'margin-inline-start': '0' },
        '.me-0': { 'margin-inline-end': '0' },
        '.ms-1': { 'margin-inline-start': '0.25rem' },
        '.me-1': { 'margin-inline-end': '0.25rem' },
        '.ms-2': { 'margin-inline-start': '0.5rem' },
        '.me-2': { 'margin-inline-end': '0.5rem' },
        '.ms-3': { 'margin-inline-start': '0.75rem' },
        '.me-3': { 'margin-inline-end': '0.75rem' },
        '.ms-4': { 'margin-inline-start': '1rem' },
        '.me-4': { 'margin-inline-end': '1rem' },
        '.ms-6': { 'margin-inline-start': '1.5rem' },
        '.me-6': { 'margin-inline-end': '1.5rem' },
        '.ms-8': { 'margin-inline-start': '2rem' },
        '.me-8': { 'margin-inline-end': '2rem' },

        // Padding inline
        '.ps-0': { 'padding-inline-start': '0' },
        '.pe-0': { 'padding-inline-end': '0' },
        '.ps-1': { 'padding-inline-start': '0.25rem' },
        '.pe-1': { 'padding-inline-end': '0.25rem' },
        '.ps-2': { 'padding-inline-start': '0.5rem' },
        '.pe-2': { 'padding-inline-end': '0.5rem' },
        '.ps-3': { 'padding-inline-start': '0.75rem' },
        '.pe-3': { 'padding-inline-end': '0.75rem' },
        '.ps-4': { 'padding-inline-start': '1rem' },
        '.pe-4': { 'padding-inline-end': '1rem' },
        '.ps-6': { 'padding-inline-start': '1.5rem' },
        '.pe-6': { 'padding-inline-end': '1.5rem' },
        '.ps-8': { 'padding-inline-start': '2rem' },
        '.pe-8': { 'padding-inline-end': '2rem' },

        // Border inline
        '.border-s': { 'border-inline-start-width': '1px' },
        '.border-e': { 'border-inline-end-width': '1px' },
        '.border-s-0': { 'border-inline-start-width': '0' },
        '.border-e-0': { 'border-inline-end-width': '0' },
        '.border-s-2': { 'border-inline-start-width': '2px' },
        '.border-e-2': { 'border-inline-end-width': '2px' },

        // Text alignment
        '.text-start': { 'text-align': 'start' },
        '.text-end': { 'text-align': 'end' },

        // Positioning
        '.start-0': { 'inset-inline-start': '0' },
        '.end-0': { 'inset-inline-end': '0' },
        '.start-auto': { 'inset-inline-start': 'auto' },
        '.end-auto': { 'inset-inline-end': 'auto' },
      });
    },
  ],
};

export default config;

/**
 * Usage Examples:
 *
 * 1. Directional padding (automatically adjusts for RTL):
 *    <div className="ps-4 pe-2"> // padding-start: 1rem, padding-end: 0.5rem
 *
 * 2. RTL-specific styles:
 *    <div className="text-left rtl:text-right">
 *
 * 3. Directional margins:
 *    <div className="ms-4"> // margin-inline-start: 1rem
 *
 * 4. Absolute positioning:
 *    <div className="start-0"> // left: 0 in LTR, right: 0 in RTL
 *
 * 5. Text alignment:
 *    <h1 className="text-start"> // text-align: left in LTR, right in RTL
 */
