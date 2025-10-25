import React, { useMemo, useState, useEffect } from 'react'
import { Card, Table, Tag, Steps, Space, Input, Select, DatePicker, Radio, Button, Switch, Row, Col, Form, Tooltip } from 'antd'

const statusSteps = (status) => {
  const map = ['待提交', '已申报', '已放行', '退税中', '已退税']
  const current = map.indexOf(status)
  return <Steps size="small" current={current} items={map.map((m) => ({ title: m }))} />
}

// 模拟数据（扩展类型与日期字段）
const data = [
  { id: 'D20240101', type: '进口', factory: 'A工厂', goods: '耐火材料', amount: 120000, status: '已申报', invoice: 'INV202312', logistics: '顺丰', consistency: '一致', createdAt: '2024-01-01', declaredAt: '2024-01-02' },
  { id: 'D20240102', type: '出口', factory: 'B工厂', goods: '机电产品', amount: 98000, status: '已放行', invoice: 'INV202311', logistics: '中通', consistency: '不一致', createdAt: '2024-01-03', declaredAt: '2024-01-05' },
  { id: 'D20240103', type: '转关', factory: 'C工厂', goods: '塑料制品', amount: 56000, status: '待申报', invoice: 'INV202310', logistics: '德邦', consistency: '一致', createdAt: '2024-01-04', declaredAt: '' },
  { id: 'D20240104', type: '进口', factory: 'D工厂', goods: '化工原料', amount: 188000, status: '异常', invoice: 'INV202309', logistics: '申通', consistency: '不一致', createdAt: '2024-01-06', declaredAt: '2024-01-07' },
]

const typeOptions = [
  { value: '进口', label: '进口' },
  { value: '出口', label: '出口' },
  { value: '转关', label: '转关' },
]

const statusOptions = [
  { value: '待申报', label: '待申报' },
  { value: '已申报', label: '已申报' },
  { value: '已放行', label: '已放行' },
  { value: '异常', label: '异常' },
]

export default function CustomsTracking() {
  // 当前筛选（编辑态）
  const [types, setTypes] = useState([])
  const [statuses, setStatuses] = useState([])
  const [dateField, setDateField] = useState('createdAt') // createdAt 或 declaredAt
  const [range, setRange] = useState([]) // [dayjs, dayjs]
  const [keyword, setKeyword] = useState('')
  const [liveUpdate, setLiveUpdate] = useState(false)
  // 移除折叠状态，保留输入缓冲
  const [kwInput, setKwInput] = useState('')

  // 已应用的筛选（用于控制“查询”模式下的结果）
  const [applied, setApplied] = useState({ types: [], statuses: [], dateField: 'createdAt', range: [], keyword: '' })

  // 加载最近筛选条件
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('customsFilters') || '{}')
      setTypes(saved.types || [])
      setStatuses(saved.statuses || [])
      setDateField(saved.dateField || 'createdAt')
      setRange(saved.range || [])
      setKeyword(saved.keyword || '')
      setKwInput(saved.keyword || '')
      setLiveUpdate(saved.liveUpdate || false)
      // 在实时刷新开启时，自动应用加载的筛选
      if (saved.liveUpdate) {
        setApplied({
          types: saved.types || [],
          statuses: saved.statuses || [],
          dateField: saved.dateField || 'createdAt',
          range: saved.range || [],
          keyword: saved.keyword || '',
        })
      }
    } catch {}
  }, [])

  // 实时刷新：编辑态改变时立即应用
  useEffect(() => {
    if (liveUpdate) {
      setApplied({ types, statuses, dateField, range, keyword })
      localStorage.setItem('customsFilters', JSON.stringify({ types, statuses, dateField, range, keyword, liveUpdate }))
    }
  }, [types, statuses, dateField, range, keyword, liveUpdate])

  // 关键字输入在实时刷新下进行轻微防抖，减少不必要的筛选计算
  useEffect(() => {
    if (!liveUpdate) return
    const t = setTimeout(() => setKeyword(kwInput), 200)
    return () => clearTimeout(t)
  }, [kwInput, liveUpdate])

  // 过滤逻辑（useMemo，提高性能）
  const filtered = useMemo(() => {
    const f = liveUpdate ? { types, statuses, dateField, range, keyword } : applied
    const [start, end] = f.range || []
    const startStr = start ? start.format('YYYY-MM-DD') : null
    const endStr = end ? end.format('YYYY-MM-DD') : null
    return data.filter((d) => {
      const typeOk = !f.types?.length || f.types.includes(d.type)
      const statusOk = !f.statuses?.length || f.statuses.includes(d.status)
      const idOk = !f.keyword || d.id.includes(f.keyword)
      let dateOk = true
      if (startStr || endStr) {
        const val = d[f.dateField]
        if (!val) return false
        dateOk = (!startStr || val >= startStr) && (!endStr || val <= endStr)
      }
      return typeOk && statusOk && idOk && dateOk
    })
  }, [types, statuses, dateField, range, keyword, applied, liveUpdate])

  const apply = () => {
    setKeyword(kwInput)
    setApplied({ types, statuses, dateField, range, keyword: kwInput })
    localStorage.setItem('customsFilters', JSON.stringify({ types, statuses, dateField, range, keyword: kwInput, liveUpdate }))
  }

  const reset = () => {
    setTypes([])
    setStatuses([])
    setDateField('createdAt')
    setRange([])
    setKeyword('')
    setKwInput('')
    setApplied({ types: [], statuses: [], dateField: 'createdAt', range: [], keyword: '' })
    localStorage.removeItem('customsFilters')
  }

  const columns = [
    { title: '报关单号', dataIndex: 'id', width: 100, ellipsis: true },
    { title: '类型', dataIndex: 'type', render: (t) => <Tag>{t}</Tag>, width: 80 },
    { title: '工厂', dataIndex: 'factory', width: 110, ellipsis: true },
    { title: '货物名称', dataIndex: 'goods', width: 120, ellipsis: true },
    { title: '金额', dataIndex: 'amount', width: 90 },
    { title: '状态', dataIndex: 'status', width: 450, render: (s) => (
       <div className="status-cell">
         <Tooltip title={`当前状态：${s}（流程：待提交 > 已申报 > 已放行 > 退税中 > 已退税）`}>
           {statusSteps(s)}
         </Tooltip>
         <span className="status-text-print">{s}</span>
       </div>
     ) },
    { title: '发票号', dataIndex: 'invoice', width: 100, ellipsis: true },
    { title: '物流公司', dataIndex: 'logistics', width: 90, ellipsis: true },
    { title: '三单一致性', dataIndex: 'consistency', render: (c) => <Tag color={c === '一致' ? 'green' : 'red'}>{c}</Tag>, width: 90 },
  ]

  return (
    <div className="content-page">
      <Card title="报关单列表">
        {/* 筛选区域：位于列表上方，响应式布局 */}
        <div className="toolbar" style={{ marginBottom: 12 }}>
          <Form className="filters-inline" layout="inline">
            {/* 第一行查询条件：类型、状态、单号 */}
            <Form.Item className="filter-item" label="类型" style={{ display: 'flex', alignItems: 'center', height: 40 }}>
              <Select
                mode="multiple"
                allowClear
                placeholder="选择类型"
                value={types}
                onChange={setTypes}
                options={typeOptions}
                maxTagCount="responsive"
                 style={{ width: 160 }}
              />
            </Form.Item>
            <Form.Item className="filter-item" label="状态" style={{ display: 'flex', alignItems: 'center', height: 40 }}>
              <Select
                mode="multiple"
                allowClear
                placeholder="选择状态"
                value={statuses}
                onChange={setStatuses}
                options={statusOptions}
                maxTagCount="responsive"
                 style={{ width: 160 }}
              />
            </Form.Item>
            <Form.Item className="filter-item" label="单号" style={{ display: 'flex', alignItems: 'center', height: 40 }}>
              <Input
                placeholder="模糊查询，如 D202401"
                value={kwInput}
                onChange={(e) => setKwInput(e.target.value)}
                allowClear
                 style={{ width: 220 }}
              />
            </Form.Item>

            {/* 强制换行到第二行 */}
            <div className="filters-break" style={{ flexBasis: '100%', height: 0 }}></div>

            {/* 第二行查询条件与操作：日期 + 操作区 */}
            <Form.Item className="filter-item" label="日期" style={{ display: 'flex', alignItems: 'center', height: 40, flex: 1 }}>
              <Radio.Group value={dateField} onChange={(e) => setDateField(e.target.value)} style={{ marginRight: 8 }}>
                <Radio.Button value="createdAt">创建日期</Radio.Button>
                <Radio.Button value="declaredAt">申报日期</Radio.Button>
              </Radio.Group>
              <DatePicker.RangePicker
                value={range}
                onChange={setRange}
                 style={{ width: 280 }}
                getPopupContainer={(node) => node.parentNode}
              />
            </Form.Item>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', height: 40 }}>
              <Space>
                <Button type="primary" onClick={apply}>查询</Button>
                <Button onClick={reset}>重置</Button>
                <Space>
                  <Switch checked={liveUpdate} onChange={setLiveUpdate} />
                  <span>实时刷新</span>
                </Space>
              </Space>
            </div>
          </Form>
        </div>

        <Table
           rowKey="id"
           columns={columns}
           dataSource={filtered}
           pagination={{ pageSize: 10 }}
           tableLayout="fixed"
          scroll={{ x: 1230, y: 480 }}
         />
      </Card>
    </div>
  )
}