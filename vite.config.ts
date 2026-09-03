import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages liefert das Projekt unter /LinuxKompass/ aus.
// Für `vite dev` bleibt die Basis "/", damit lokale Links funktionieren.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/LinuxKompass/' : '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
}));
