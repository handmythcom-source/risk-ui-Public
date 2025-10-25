import React, { useState } from 'react'
import { Card, Table, Tag, Space, Button, message } from 'antd'

const initial = [
  { id: 'E1001', factory: 'A工厂', type: '重大经营风险', level: '红色', status: '待分派', time: '2024-06-01 10:22' },
  { id: 'E1002', factory: 'B工厂', type: '高频操作风险', level: '橙色', status: '整改中', time: '2024-06-02 12:01' },
  { id: 'E1003', factory: 'C工厂', type: '潜在合规风险', level: '黄色', status: '待分派', time: '2024-06-02 13:45' },
]

const levelColor = (level) => (level === '红色' ? 'red' : level === '橙色' ? 'orange' : 'gold')

export default function RiskCenter() {
  const [data, setData] = useState(initial)

  const assign = (id) => {
    setData((arr) => arr.map((it) => (it.id === id ? { ...it, status: '整改中' } : it)))
    message.success('已分派整改')
  }

  const close = (id) => {
    setData((arr) => arr.map((it) => (it.id === id ? { ...it, status: '已关闭' } : it)))
    message.success('工单已关闭')
  }

  const columns = [
    { title: '事件ID', dataIndex: 'id' },
    { title: '工厂', dataIndex: 'factory' },
    { title: '风险类型', dataIndex: 'type' },
    { title: '预警等级', dataIndex: 'level', render: (l) => <Tag color={levelColor(l)}>{l}</Tag> },
    { title: '触发时间', dataIndex: 'time' },
    { title: '处理状态', dataIndex: 'status' },
    { title: '操作', render: (_, r) => <Space>
      <Button size="small" onClick={() => assign(r.id)}>分派</Button>
      <Button size="small" type="primary" onClick={() => close(r.id)}>关闭</Button>
    </Space> },
  ]

  return (
    <div className="content-page">
      <Card title="预警队列">
        <Table rowKey="id" dataSource={data} columns={columns} />
      </Card>
    </div>
  )
}