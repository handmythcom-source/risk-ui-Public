import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, Tag, Spin, Table, Tooltip, Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import EChart from '../components/EChart'
import { getRuleRanking, getFactoryRanking } from '../services/riskOverviewApi'

const riskBarOption = {
  tooltip: {},
  xAxis: { type: 'category', data: ['低', '中', '高', '极高'] },
  yAxis: { type: 'value' },
  series: [
    { name: '工厂数量', type: 'bar', data: [52, 31, 12, 3], itemStyle: { color: '#0EA5E9' } },
  ],
}

const efficiencyLineOption = {
  tooltip: {},
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  yAxis: { type: 'value' },
  series: [
    { name: '退税平均周期(天)', type: 'line', data: [65, 62, 60, 58, 61, 59], lineStyle: { color: '#0EA5E9' } },
  ],
}

// 新增：严重等级颜色与权重
const levelWeight = (s) => (s === '红色' ? 3 : s === '橙色' ? 2 : 1)
const levelColor = (s) => (s === '红色' ? 'red' : s === '橙色' ? 'orange' : 'gold')

export default function Dashboard() {
  const navigate = useNavigate()
  const [navLoading, setNavLoading] = useState('')
  const [navPending, setNavPending] = useState(false)

  // 新增：模块数据与刷新
  const [ruleData, setRuleData] = useState([])
  const [factoryData, setFactoryData] = useState([])
  const [tfactory, setTfactory] = useState('30d')
  const [loadingRules, setLoadingRules] = useState(false)
  const [loadingFactories, setLoadingFactories] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoadingRules(true)
      setLoadingFactories(true)
      const [r, f] = await Promise.all([
        getRuleRanking('30d'),
        getFactoryRanking(tfactory),
      ])
      if (!mounted) return
      setRuleData(r)
      setFactoryData(f)
      setLoadingRules(false)
      setLoadingFactories(false)
    }
    load()
    const timer = setInterval(load, 30000)
    return () => { mounted = false; clearInterval(timer) }
  }, [tfactory])

  const getCurrentFilters = () => {
    try {
      return JSON.parse(localStorage.getItem('dashboardFilters') || '{}')
    } catch {
      return {}
    }
  }

  const buildQuery = (params) => {
    const qp = new URLSearchParams(params).toString()
    return qp ? `?${qp}` : ''
  }

  const handleNavigate = (key, path, params) => (e) => {
    e?.preventDefault?.()
    if (navPending) return
    setNavPending(true)
    const base = getCurrentFilters()
    const query = { from: 'dashboard', ts: Date.now(), metric: key, ...base, ...params }
    setNavLoading(key)
    setTimeout(() => {
      setNavPending(false)
      navigate(`${path}${buildQuery(query)}`)
    }, 250)
  }

  // 新增：列表列配置
  const ruleColumns = [
    { title: '规则名称', dataIndex: 'name', render: (text, r) => (
      <Tooltip title={`规则ID：${r.id}`}>
        <a onClick={() => navigate('/rules')}>{text}</a>
      </Tooltip>
    ) },
    { title: '触发次数', dataIndex: 'count', sorter: (a, b) => a.count - b.count, defaultSortOrder: 'descend' },
    { title: '趋势变化', dataIndex: 'trendPercent', sorter: (a, b) => a.trendPercent - b.trendPercent, render: (p) => (
      p > 0 ? <Tag color="green">↑ {p}%</Tag> : p < 0 ? <Tag color="red">↓ {Math.abs(p)}%</Tag> : <Tag>—</Tag>
    ) },
  ]

  const factoryColumns = [
    { title: '工厂名称', dataIndex: 'name', render: (text, f) => (
      <Tooltip title={`工厂ID：${f.id}`}>
        <a onClick={() => navigate(`/factory/${f.id}`)}>{text}</a>
      </Tooltip>
    ) },
    { title: '触发规则数量', dataIndex: 'count', sorter: (a, b) => a.count - b.count, defaultSortOrder: 'descend' },
    { title: '严重等级', dataIndex: 'severity', sorter: (a, b) => levelWeight(a.severity) - levelWeight(b.severity), render: (s) => <Tag color={levelColor(s)}>{s}</Tag> },
  ]

  // 新增：图表配置
  const ruleRankOption = {
    tooltip: {},
    xAxis: { type: 'category', data: ruleData.map(r => r.name) },
    yAxis: { type: 'value' },
    series: [{ name: '触发次数', type: 'bar', data: ruleData.map(r => r.count), itemStyle: { color: '#0EA5E9' } }],
  }

  const factoryRankOption = {
    tooltip: {},
    xAxis: { type: 'category', data: factoryData.map(f => f.name) },
    yAxis: { type: 'value' },
    series: [{ name: '触发规则数量', type: 'bar', data: factoryData.map(f => f.count), itemStyle: { color: '#0EA5E9' } }],
  }

  return (
    <div className="content-page">
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            className="metric-card"
            onClick={handleNavigate('total_factories', '/factory/list', { timeframe: 'all' })}
            onTouchEnd={handleNavigate('total_factories', '/factory/list', { timeframe: 'all' })}
            data-testid="metric-total-factories"
            tabIndex={0}
          >
            <Spin spinning={navLoading === 'total_factories'}>
              <Statistic title="总工厂数" value={98} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            className="metric-card"
            onClick={handleNavigate('weekly_alerts', '/risks', { timeframe: 'week' })}
            onTouchEnd={handleNavigate('weekly_alerts', '/risks', { timeframe: 'week' })}
            data-testid="metric-weekly-alerts"
            tabIndex={0}
          >
            <Spin spinning={navLoading === 'weekly_alerts'}>
              <Statistic title="本周新增预警" value={12} suffix={<Tag color="red">红/3 橙/5 黄/4</Tag>} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            className="metric-card"
            onClick={handleNavigate('avg_rebate_cycle', '/rebates/analytics', { timeframe: '6m' })}
            onTouchEnd={handleNavigate('avg_rebate_cycle', '/rebates/analytics', { timeframe: '6m' })}
            data-testid="metric-avg-rebate-cycle"
            tabIndex={0}
          >
            <Spin spinning={navLoading === 'avg_rebate_cycle'}>
              <Statistic title="平均退税周期(天)" value={60} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            className="metric-card"
            onClick={handleNavigate('closure_rate', '/risks/workorders', { status: 'closed' })}
            onTouchEnd={handleNavigate('closure_rate', '/risks/workorders', { status: 'closed' })}
            data-testid="metric-closure-rate"
            tabIndex={0}
          >
            <Spin spinning={navLoading === 'closure_rate'}>
              <Statistic title="闭环率" value={95} suffix="%" />
            </Spin>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="风险等级分布">
            <EChart option={riskBarOption} style={{ height: 340 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="退税效率趋势">
            <EChart option={efficiencyLineOption} style={{ height: 340 }} />
          </Card>
        </Col>
      </Row>

      {/* 新增模块：左右分栏布局，间距16px，标题统一风格 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="触发规则排名（Top 10）" extra={<span style={{ color: '#8c8c8c' }}>每30秒自动刷新</span>}>
            <EChart option={ruleRankOption} style={{ height: 240 }} />
            <Table
              rowKey="id"
              size="small"
              pagination={false}
              dataSource={ruleData}
              columns={ruleColumns}
              loading={loadingRules}
              style={{ marginTop: 12 }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="当前触发规则的工厂排名（Top 10）"
            extra={<Select size="small" value={tfactory} onChange={setTfactory} options={[{ value: '7d', label: '近7天' }, { value: '30d', label: '近30天' }, { value: '90d', label: '近90天' }]} />}
          >
            <EChart option={factoryRankOption} style={{ height: 240 }} />
            <Table
              rowKey="id"
              size="small"
              pagination={false}
              dataSource={factoryData}
              columns={factoryColumns}
              loading={loadingFactories}
              style={{ marginTop: 12 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}