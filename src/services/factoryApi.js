// 统一工厂数据 API。可替换为真实后端，当前提供开发环境模拟与错误处理。
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const tryFetch = async (url) => {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    return null // 失败时由本地模拟数据兜底
  }
}

export async function getFactoryDetail(id) {
  // 优先请求真实接口
  const real = await tryFetch(`${API_BASE}/factories/${id}`)
  if (real) return real
  // 模拟数据（参考阿里工厂详情布局字段）
  await sleep(500)
  return {
    id,
    basic: { name: `${id}工厂`, address: '上海市浦东新区示例路88号', contact: '021-888888', phone: '138****0000', email: 'factory@example.com' },
    capacity: { equipmentCount: 56, employees: 320, capacity: { monthly: '12000件', daily: '400件' } },
    certifications: [ 'ISO9001', 'ISO14001', 'CE', 'RoHS' ],
    customers: [ { name: '阿里巴巴', case: '年度代工合作' }, { name: '华为', case: '专项供应项目' } ],
    gallery: [ '/public/vite.svg', '/public/vite.svg', '/public/vite.svg' ],
  }
}

export async function getFactoryScoreReport(id) {
  const real = await tryFetch(`${API_BASE}/factories/${id}/score`)
  if (real) return real
  await sleep(500)
  return {
    id,
    score: 86,
    dimensions: [
      { key: '质量', score: 88, notes: '来料检验严格，不良率低' },
      { key: '交期', score: 82, notes: '交付准时率高，旺季略有波动' },
      { key: '服务', score: 90, notes: '沟通响应快，售后完善' },
      { key: '成本', score: 84, notes: '成本控制良好，有优化空间' },
    ],
    trend: { months: ['1月','2月','3月','4月','5月','6月'], values: [80,82,84,85,86,87] },
    suggestions: [ '提升旺季排产能力，减少交期波动', '持续优化供应链，降低采购成本' ],
  }
}