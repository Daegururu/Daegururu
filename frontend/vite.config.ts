import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      port: 3000,
      // 인증이 HttpOnly 쿠키(SameSite=Lax)라 localhost에서 백엔드 주소로 직접 부르면 브라우저가
      // 쿠키를 저장·전송하지 않습니다. 개발 중에는 /api를 여기서 백엔드로 넘겨 같은 오리진으로 보이게 합니다.
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
  }
})
