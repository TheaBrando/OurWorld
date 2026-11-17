import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // 如果使用 username.github.io/dios-archive/，改成 "/dios-archive/"。
  // 如果使用 username.github.io 或自定义域名根路径，保持 "/"。
  base: "/",
});
