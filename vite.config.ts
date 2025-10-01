import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		minify: true,
		cssMinify: true,
		chunkSizeWarningLimit: 1024,
		rollupOptions: {
			output: {
				manualChunks: {
					dexie: ['dexie', 'dexie-react-hooks'],
					react: ['react-router', 'react', 'react-dom', 'react-hook-form', 'react-redux'],
					markdown: ['@uiw/react-markdown-preview', '@uiw/react-md-editor'],
				},
			},
		},
	},
});
