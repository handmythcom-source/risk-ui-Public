import React from 'react'
import { Card } from 'antd'
import EChart from '../components/EChart'

const option = {
  title: { text: '退税额波动' },
  tooltip: {},
  xAxis: { type: 'category', data: ['1月','2月','3月','4月','5月','6月'] },
  yAxis: { type: 'value' },
  series: [
    { name: '退税额(万元)', type: 'line', data: [120, 160, 110, 180, 140, 150], lineStyle: { color: '#0EA5E9' } },
  ],
}

export default function RebateAnalytics() {
  return (
    <div className="content-page">
      <Card>
        <EChart option={option} style={{ height: 360 }} />
      </Card>
    </div>
  )
}