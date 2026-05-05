/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    // include devtool overlay CSS so Tailwind generates utilities used there
    "./node_modules/vite-plugin-vue-devtools/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        // Provide gray palette for Tailwind v4 compatibility
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Rwanda flag inspired colors with extended palette
        primary: {
          light: '#FFF5E6', // Light yellow background
          lighter: '#FFFBF0',
          DEFAULT: '#FFD700', // Gold
          dark: '#FFA500',
          darker: '#FF9500',
        },
        secondary: {
          light: '#E8F5E9', // Light green background
          lighter: '#F1F8F6',
          DEFAULT: '#00B854', // Green
          dark: '#008C45',
          darker: '#007A3A',
        },
        accent: {
          light: '#E8F5E9',
          DEFAULT: '#4CAF50',
          dark: '#1B5E20',
        },
        'kigali-blue': {
          light: '#E3F2FD',
          lighter: '#F0F7FF',
          DEFAULT: '#1976D2',
          dark: '#1565C0',
          darker: '#1455B0',
        },
        'kigali-red': {
          light: '#FFEBEE',
          DEFAULT: '#E53935',
          dark: '#C62828',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'elevation': '0 12px 24px -4px rgba(0, 0, 0, 0.12)',
        'elevation-md': '0 8px 16px -2px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-soft': 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(0, 184, 84, 0.05) 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FFD700 0%, #00B854 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
