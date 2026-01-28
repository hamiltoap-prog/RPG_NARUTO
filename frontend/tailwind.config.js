/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
	extend: {
		fontFamily: {
			sans: ['Manrope', 'sans-serif'],
			heading: ['Syne', 'sans-serif'],
			mono: ['JetBrains Mono', 'monospace']
		},
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		},
		colors: {
			background: '#020617',
			foreground: '#F8FAFC',
			card: {
				DEFAULT: '#0F172A',
				foreground: '#F1F5F9'
			},
			popover: {
				DEFAULT: '#0F172A',
				foreground: '#F8FAFC'
			},
			primary: {
				DEFAULT: '#F97316',
				foreground: '#FFFFFF'
			},
			secondary: {
				DEFAULT: '#3B82F6',
				foreground: '#FFFFFF'
			},
			muted: {
				DEFAULT: '#1E293B',
				foreground: '#94A3B8'
			},
			accent: {
				DEFAULT: '#10B981',
				foreground: '#FFFFFF'
			},
			destructive: {
				DEFAULT: '#EF4444',
				foreground: '#FFFFFF'
			},
			border: '#1E293B',
			input: '#1E293B',
			ring: '#F97316'
		},
		keyframes: {
			'accordion-down': {
				from: {
					height: '0'
				},
				to: {
					height: 'var(--radix-accordion-content-height)'
				}
			},
			'accordion-up': {
				from: {
					height: 'var(--radix-accordion-content-height)'
				},
				to: {
					height: '0'
				}
			},
			'dice-roll': {
				'0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
				'100%': { transform: 'rotateX(720deg) rotateY(720deg)' }
			},
			'fade-in': {
				'0%': { opacity: '0', transform: 'translateY(10px)' },
				'100%': { opacity: '1', transform: 'translateY(0)' }
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'dice-roll': 'dice-roll 1s ease-out',
			'fade-in': 'fade-in 0.3s ease-out'
		}
	}
  },
  plugins: [require("tailwindcss-animate")],
};