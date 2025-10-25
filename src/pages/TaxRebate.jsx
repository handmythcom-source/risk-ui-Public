import React from 'react'
import { Card, Table, Tag } from 'antd'

const data = [
  { id: 'R20240101', declareId: 'D20240101', rate: 13, amount: 15600, applyDate: '2024-02-02', received: '2024-03-05', forex: '匹配', cycleDays: 60 },
  { id: 'R20240102', declareId: 'D20240102', rate: 9, amount: 8820, applyDate: '2024-02-10', received: '2024-03-10', forex: '不匹配', cycleDays: 72 },
]

export default function TaxRebate() {
  const columns = [
    { title: '退税单号', dataIndex: 'id' },
    { title: '报关单号', dataIndex: 'declareId' },
    { title: '退税率(%)', dataIndex: 'rate' },
    { title: '退税金额', dataIndex: 'amount' },
    { title: '申请日期', dataIndex: 'applyDate' },
    { title: '到账日期', dataIndex: 'received' },
    { title: '外汇核销', dataIndex: 'forex', render: (v) => <Tag color={v === '匹配' ? 'green' : 'red'}>{v}</Tag> },
    { title: '退税周期(天)', dataIndex: 'cycleDays' },
  ]

  return (
    <div className="content-page">
      <Card title="退税记录">
        <Table rowKey="id" columns={columns} dataSource={data} />
      </Card>
    </div>
  )
}