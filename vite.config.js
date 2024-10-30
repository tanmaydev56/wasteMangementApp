import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load environment variables based on the mode (development or production)
  const env = loadEnv(mode, process.cwd(), ''); // Change import.meta.cwd() to process.cwd()

  return {
    plugins: [react()],
    define: {
      // Use the loaded environment variables directly
      'VITE_PUBLIC_DATABASE_ID': JSON.stringify(env.VITE_PUBLIC_DATABASE_ID),
      'VITE_PUBLIC_COLLECTION_ID': JSON.stringify(env.VITE_PUBLIC_COLLECTION_ID),
      'VITE_PUBLIC_PROJECT_ID': JSON.stringify(env.VITE_PUBLIC_PROJECT_ID),
      'VITE_PUBLIC_SUCCESS_REDIRECT_URL': JSON.stringify(env.VITE_PUBLIC_SUCCESS_REDIRECT_URL),
      'VITE_PUBLIC_FAILURE_REDIRECT_URL': JSON.stringify(env.VITE_PUBLIC_FAILURE_REDIRECT_URL),
    },
  };
});
