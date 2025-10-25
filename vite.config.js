import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// 动态 base：GH Pages 下为 /<repo>/，其他平台保持根路径
// 性能优化：手动分包拆分 react/antd/echarts，降低单包体积
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE || '/'
  return defineConfig({
    plugins: [react()],
    base,
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'react'
              if (id.includes('antd') || id.includes('@ant-design/icons')) return 'antd'
              if (id.includes('echarts')) return 'echarts'
            }
          },
        },
      },
      chunkSizeWarningLimit: 1600,
    },
  })
}
