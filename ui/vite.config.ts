// vite.config.js
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { graphql } from './plugins/graphql';

export default defineConfig({
  plugins: [react(), graphql()],
});
