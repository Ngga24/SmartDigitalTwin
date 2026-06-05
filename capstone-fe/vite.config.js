import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "dtwin.projectbase.my.id",
      "smart-dtwin.projectbase.my.id",
      "localhost",
    ],
    host: "0.0.0.0",
    port: 85,
  },
});
