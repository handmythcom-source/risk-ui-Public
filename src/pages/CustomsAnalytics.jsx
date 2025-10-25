import React from 'react'
import { Card } from 'antd'
import EChart from '../components/EChart'

const option = {
  title: { text: '物流与报关时效偏差' },
  tooltip: {},
  legend: { data: ['本厂', '行业均值'] },
  xAxis: { type: 'category', data: ['报关', '运输', '放行'] },
  yAxis: { type: 'value', name: '小时' },
  series: [
    { name: '本厂', type: 'bar', data: [8, 24, 6], itemStyle: { color: '#0EA5E9' } },
    { name: '行业均值', type: 'bar', data: [6, 20, 5], itemStyle: { color: '#65c3f7' } },
  ],
}

export default function CustomsAnalytics() {
  return (
    <div className="content-page">
      <Card>
        <EChart option={option} style={{ height: 360 }} />
      </Card>
    </div>
  )
}
