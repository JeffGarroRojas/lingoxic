import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
 optimizeDeps: {
  include: ["recharts", "recharts-scale", "decimal.js-light"],
 },
 build: {
  commonjsOptions: {
   transformMixedEsModules: true,
  },
 },
 plugins: [
 react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: { maximumFileSizeToCacheInBytes: 3000000, globPatterns: ["**/*.{js,css,html,ico,png,svg,mp3}"] },
      includeAssets: ["icons/icon-192x192.png", "icons/icon-512x512.png", "icons/logolingo-512.png"],
      manifest: {
        name: "LinGoXiC - Aprende Inglés con IA",
        short_name: "LinGoXiC",
        description:
          "Prepárate para las Pruebas Nacionales de Inglés del MEP con IA",
        start_url: "/dashboard",
        display: "standalone",
        background_color: "#0F172A",
        theme_color: "#0EA5E9",
        lang: "es",
        scope: "/",
        orientation: "portrait",
        categories: ["education", "language"],
        shortcuts: [
          {
            name: "Práctica Rápida",
            short_name: "Practicar",
            url: "/practice",
            icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
          },
          {
            name: "Simulacro",
            short_name: "Examen",
            url: "/exam-sim",
            icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
          },
        ],
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
