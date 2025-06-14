// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///home/project/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import { sveltePreprocess } from "file:///home/project/node_modules/svelte-preprocess/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        typescript: true
      })
    })
  ],
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.svg"]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSBcIkBzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGVcIjtcbmltcG9ydCB7IHN2ZWx0ZVByZXByb2Nlc3MgfSBmcm9tIFwic3ZlbHRlLXByZXByb2Nlc3NcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBzdmVsdGUoe1xuICAgICAgcHJlcHJvY2Vzczogc3ZlbHRlUHJlcHJvY2Vzcyh7XG4gICAgICAgIHR5cGVzY3JpcHQ6IHRydWUsXG4gICAgICB9KSxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogXCIvc3JjXCIsXG4gICAgfSxcbiAgfSxcbiAgYXNzZXRzSW5jbHVkZTogW1wiKiovKi5wbmdcIiwgXCIqKi8qLmpwZ1wiLCBcIioqLyouc3ZnXCJdLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLFNBQVMsY0FBYztBQUN2QixTQUFTLHdCQUF3QjtBQUdqQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxZQUFZLGlCQUFpQjtBQUFBLFFBQzNCLFlBQVk7QUFBQSxNQUNkLENBQUM7QUFBQSxJQUNILENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsSUFDUDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGVBQWUsQ0FBQyxZQUFZLFlBQVksVUFBVTtBQUNwRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
