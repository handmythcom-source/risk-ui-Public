import React from 'react'
import { Card, Table, Tag } from 'antd'

const data = [
  { id: 'W001', eventId: 'E1001', factory: 'A工厂', sla: '24h', status: '整改中', owner: '风控-张三' },
  { id: 'W002', eventId: 'E1002', factory: 'B工厂', sla: '48h', status: '已关闭', owner: '业务-李四' },
]

export default function WorkOrders() {
  const columns = [
    { title: '工单ID', dataIndex: 'id' },
    { title: '事件ID', dataIndex: 'eventId' },
    { title: '工厂', dataIndex: 'factory' },
    { title: 'SLA', dataIndex: 'sla' },
    { title: '状态', dataIndex: 'status', render: (s) => <Tag color={s === '已关闭' ? 'green' : 'orange'}>{s}</Tag> },
    { title: '责任人', dataIndex: 'owner' },
  ]

  return (
    <div className="content-page">
      <Card title="工单闭环">
        <Table rowKey="id" dataSource={data} columns={columns} />
      </Card>
    </div>
  )
}