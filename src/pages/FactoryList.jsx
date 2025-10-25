import React, { useMemo, useState, useEffect } from 'react'
import { Card, Table, Tag, Space, Input, Select, Modal, Spin, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getFactoryScoreReport } from '../services/factoryApi'
import EChart from '../components/EChart'

const dataSource = [
  { id: 1, name: 'A工厂', taxpayerId: '9137XXXXA', rating: 'A', lawsuit: '无', region: '上海', riskScore: 88, tags: ['高效率'] },
  { id: 2, name: 'B工厂', taxpayerId: '9137XXXXB', rating: 'B', lawsuit: '原告', region: '杭州', riskScore: 72, tags: ['地址变更'] },
  { id: 3, name: 'C工厂', taxpayerId: '9137XXXXC', rating: 'C', lawsuit: '被告', region: '苏州', riskScore: 55, tags: ['高税负波动'] },
]

export default function FactoryList() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [rating, setRating] = useState()
  const [scoreVisible, setScoreVisible] = useState(false)
  const [scoreLoading, setScoreLoading] = useState(false)
  const [scoreData, setScoreData] = useState(null)
  
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('factoryFilters') || '{}')
      setKeyword(saved.keyword || '')
      setRating(saved.rating)
    } catch {}
  }, [])

  const filtered = useMemo(() => {
    return dataSource.filter((d) =>
      (!rating || d.rating === rating) &&
      (!keyword || d.name.includes(keyword) || d.taxpayerId.includes(keyword))
    )
  }, [keyword, rating])

  const openScore = async (id) => {
    setScoreVisible(true)
    setScoreLoading(true)
    try {
      const res = await getFactoryScoreReport(id)
      setScoreData(res)
    } catch (e) {
      message.error(e.message || '评分报告加载失败')
    } finally {
      setScoreLoading(false)
    }
  }

  const closeScore = () => {
    setScoreVisible(false)
    setScoreData(null)
  }

  const goDetail = (id) => {
    localStorage.setItem('factoryFilters', JSON.stringify({ keyword, rating }))
    navigate(`/factory/${id}`)
  }

  const columns = [
    { title: '企业名称', dataIndex: 'name' },
    { title: '纳税人识别号', dataIndex: 'taxpayerId' },
    { title: '纳税评级', dataIndex: 'rating' },
    { title: '法律诉讼', dataIndex: 'lawsuit' },
    { title: '地域', dataIndex: 'region' },
    { title: '风险评分', dataIndex: 'riskScore' },
    { title: '风险标签', dataIndex: 'tags', render: (tags) => tags.map((t) => <Tag key={t}>{t}</Tag>) },
    { title: '操作', render: (_, r) => <Space>
      <div className="op-action" onClick={() => goDetail(r.id)}>详情</div>
      <a className="op-action" onClick={() => openScore(r.id)}>评分报告</a>
    </Space> },
  ]

  const trendOption = scoreData ? {
    tooltip: {},
    xAxis: { type: 'category', data: scoreData.trend.months },
    yAxis: { type: 'value' },
    series: [ { type: 'line', data: scoreData.trend.values, lineStyle: { color: '#0EA5E9' } } ],
  } : null

  return (
    <div className="content-page">
      <Card title="工厂列表" extra={<Space>
        <Input placeholder="名称或识别号" value={keyword} onChange={(e) => setKeyword(e.target.value)} allowClear />
        <Select placeholder="纳税评级" value={rating} onChange={setRating} allowClear style={{ width: 120 }}
          options={[{value:'A', label:'A'}, {value:'B', label:'B'}, {value:'C', label:'C'}]}
        />
      </Space>}>
        <Table rowKey="id" dataSource={filtered} columns={columns} pagination={{ pageSize: 8 }} />
      </Card>

      <Modal
        title={scoreData ? `评分报告 - 工厂 ${scoreData.id}` : '评分报告'}
        open={scoreVisible}
        onCancel={closeScore}
        footer={null}
        width={720}
      >
        {scoreLoading && <div style={{ textAlign: 'center' }}><Spin /></div>}
        {!scoreLoading && scoreData && (
          <div style={{ display: 'grid', gap: 12 }}>
            <Card size="small" title="综合评分">
              <Space>
                <Tag color="blue">百分制</Tag>
                <span style={{ fontSize: 24, fontWeight: 600 }}>{scoreData.score}</span>
              </Space>
            </Card>
            <Card size="small" title="评分维度">
              <Table
                size="small"
                rowKey={(r) => r.key}
                dataSource={scoreData.dimensions}
                columns={[
                  { title: '维度', dataIndex: 'key' },
                  { title: '分数', dataIndex: 'score' },
                  { title: '评分依据', dataIndex: 'notes' },
                ]}
                pagination={false}
              />
            </Card>
            <Card size="small" title="历史评分趋势">
              <EChart option={trendOption} style={{ height: 220 }} />
            </Card>
            <Card size="small" title="改进建议">
              {scoreData.suggestions.map((s, i) => <div key={i}>• {s}</div>)}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  )
}