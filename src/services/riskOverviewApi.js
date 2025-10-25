// 模拟风险全景首页的数据服务：规则排名与工厂排名

const baseRules = [
  { id: 'R001', name: '发票三单不一致', count: 128, trendPercent: 12 },
  { id: 'R002', name: '异常报关频次', count: 115, trendPercent: -5 },
  { id: 'R003', name: '退税周期过长', count: 98, trendPercent: 3 },
  { id: 'R004', name: '重复申报疑点', count: 86, trendPercent: -8 },
  { id: 'R005', name: '金额异常波动', count: 79, trendPercent: 6 },
  { id: 'R006', name: '货物品类异常', count: 71, trendPercent: 2 },
  { id: 'R007', name: '物流轨迹异常', count: 66, trendPercent: -2 },
  { id: 'R008', name: '高频人工干预', count: 62, trendPercent: 4 },
  { id: 'R009', name: '申报字段缺失', count: 58, trendPercent: 1 },
  { id: 'R010', name: '收发货异常区域', count: 55, trendPercent: -1 },
]

const baseFactories = [
  { id: 'F001', name: 'A工厂', count: 42, severity: '红色' },
  { id: 'F002', name: 'B工厂', count: 38, severity: '橙色' },
  { id: 'F003', name: 'C工厂', count: 35, severity: '黄色' },
  { id: 'F004', name: 'D工厂', count: 33, severity: '橙色' },
  { id: 'F005', name: 'E工厂', count: 31, severity: '黄色' },
  { id: 'F006', name: 'F工厂', count: 28, severity: '红色' },
  { id: 'F007', name: 'G工厂', count: 26, severity: '黄色' },
  { id: 'F008', name: 'H工厂', count: 24, severity: '橙色' },
  { id: 'F009', name: 'I工厂', count: 23, severity: '黄色' },
  { id: 'F010', name: 'J工厂', count: 21, severity: '黄色' },
]

function factorByTimeframe(tf) {
  // 不同时间维度下的缩放因子
  switch (tf) {
    case '7d': return 0.6
    case '30d': return 1.0
    case '90d': return 1.4
    default: return 1.0
  }
}

function jitter(val, range = 5) {
  const delta = Math.round((Math.random() - 0.5) * range)
  return Math.max(val + delta, 0)
}

export async function getRuleRanking(timeframe = '30d') {
  const k = factorByTimeframe(timeframe)
  // 模拟刷新时数据轻微波动
  return baseRules.map(r => ({
    ...r,
    count: Math.round(jitter(r.count * k, 6)),
    trendPercent: jitter(r.trendPercent, 4),
  }))
}

export async function getFactoryRanking(timeframe = '30d') {
  const k = factorByTimeframe(timeframe)
  return baseFactories.map(f => ({
    ...f,
    count: Math.round(jitter(f.count * k, 6)),
  }))
}