import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Email-generator-/",
  test: {
    environment: "jsdom",
    globals: true,
  },
});
