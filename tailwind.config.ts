
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// New color palette
				app: {
					primary: '#1E88E5',       // Botones principales, encabezados
					secondary: '#43A047',     // Botones secundarios, estadísticas positivas
					accent1: '#FBC02D',       // Elementos interactivos, alertas suaves
					accent2: '#0288D1',       // Fondos secundarios, estados hover
					bgLight: '#F5F7FA',       // Fondo en modo claro
					bgDark: '#212121',        // Fondo en modo oscuro
					textMain: '#212121',      // Texto en modo claro
					textSecondary: '#757575', // Descripciones, etiquetas
					textDark: '#E0E0E0',      // Texto en modo oscuro
					success: '#2E7D32',       // Mensajes de confirmación
					error: '#D32F2F',         // Mensajes de error
					warning: '#F57C00'        // Alertas intermedias
				},
				// RutaPro platform colors
				platform: {
					uber: '#000000',
					didi: '#fc4c01',
					indrive: '#c1f11d',
					mano: '#1e88e5',
					coopebombas: '#0d768c'
				},
				expense: {
					fuel: '#f97316',
					food: '#84cc16',
					wash: '#0ea5e9',
					maintenance: '#8b5cf6',
					other: '#64748b'
				},
				taxi: {
					primary: '#f59e0b',
					secondary: '#fbbf24',
					accent: '#fef3c7',
					background: '#fffbeb',
					foreground: '#78350f',
					muted: '#fdba74',
				},
				rideshare: {
					primary: '#1e293b',
					secondary: '#334155',
					accent: '#94a3b8',
					background: '#0f172a',
					foreground: '#f8fafc',
					muted: '#475569',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
