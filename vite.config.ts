import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
	plugins: [react()],
	base: '/admin/',
	server: {
		host: true,
		port: 5173,
	},
})

