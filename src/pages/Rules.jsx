import React, { useState } from 'react'
import { Card, Table, Switch, Tag } from 'antd'

const initial = [
  { id: 'R-001', name: '国际价格偏离度>20%', type: '静态', priority: 1, enabled: true },
  { id: 'R-002', name: '连续3次单证错误', type: '动态', priority: 2, enabled: true },
  { id: 'R-003', name: '退税率>13%且单价>同类均价', type: '退税专项', priority: 2, enabled: false },
]

export default function Rules() {
  const [data, setData] = useState(initial)

  const toggle = (id, checked) => setData((arr) => arr.map((it) => it.id === id ? { ...it, enabled: checked } : it))

  const columns = [
    { title: '规则ID', dataIndex: 'id' },
    { title: '名称', dataIndex: 'name' },
    { title: '类型', dataIndex: 'type', render: (t) => <Tag>{t}</Tag> },
    { title: '优先级', dataIndex: 'priority' },
    { title: '启用', dataIndex: 'enabled', render: (v, r) => <Switch checked={v} onChange={(c) => toggle(r.id, c)} /> },
  ]

  return (
    <div className="content-page">
      <Card title="规则管理">
        <Table rowKey="id" columns={columns} dataSource={data} />
      </Card>
    </div>
  )
}