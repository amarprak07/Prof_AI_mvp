import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listen on all addresses (needed for external access)
    
    port: 5173, // or whatever port you prefer
    allowedHosts: ['c1b13b8eeb38.ngrok-free.app'], // ✅ for Vite >=5
  },
})


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true,       // listen on 0.0.0.0 (needed for ngrok)
//     port: 5173,
//     proxy: {
//       "/api": {
//         target: "http://127.0.0.1:3000", // your backend
//         changeOrigin: true,
//         secure: false,
//         ws: true,
//         // optionally strip a prefix:
//         // rewrite: (path) => path.replace(/^\/api/, "/api"),
//       },
//     },
//   },
// });
