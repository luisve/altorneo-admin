import { defineConfig } from 'vite'
//import react from '@vitejs/plugin-react-swc'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	base: '/admin/',
	server: {
		host: true,
		port: 5173,
	},
	build: {
		chunkSizeWarningLimit: 800,
		rolldownOptions: {
			output: {
				codeSplitting: {
					groups: [
						{
							name: 'react-vendor',
							test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
							priority: 30,
						},
						{
							name: 'pdf-vendor',
							test: /node_modules[\\/](jspdf|jspdf-autotable|html2canvas|canvg|dompurify|fflate)[\\/]/,
							priority: 20,
						},
						{
							name: 'xlsx-vendor',
							test: /node_modules[\\/]xlsx/,
							priority: 20,
						},
						{
							name: 'vendor',
							test: /node_modules/,
							priority: 10,
						},
					],
				},
			},
		},
	},
})

