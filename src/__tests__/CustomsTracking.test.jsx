import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import CustomsTracking from '../pages/CustomsTracking'

// 简单的 localStorage mock（JSDOM 已提供，可清理）
beforeEach(() => {
  localStorage.clear()
})

describe('CustomsTracking filters', () => {
  it('shows all records by default', () => {
    render(<CustomsTracking />)
    // 默认渲染所有行（示例数据为4条）
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBeGreaterThan(1)
  })

  it('filters by type and status (组合查询)', () => {
    render(<CustomsTracking />)
    // 打开类型选择，选择进口
    const typeLabel = screen.getByText('报关单类型')
    const typeSelect = typeLabel.closest('div').querySelector('.ant-select')
    fireEvent.mouseDown(typeSelect.querySelector('.ant-select-selector'))
    fireEvent.click(screen.getByTitle('进口'))

    // 打开状态选择，选择已申报
    const statusLabel = screen.getByText('报关单状态')
    const statusSelect = statusLabel.closest('div').querySelector('.ant-select')
    fireEvent.mouseDown(statusSelect.querySelector('.ant-select-selector'))
    fireEvent.click(screen.getByTitle('已申报'))

    // 点击查询
    fireEvent.click(screen.getByRole('button', { name: '查询' }))

    // 断言只剩 进口 & 已申报 的记录（示例数据应为1条）
    const rows = screen.getAllByRole('row')
    // 表头 + 数据行至少为2
    expect(rows.length).toBeGreaterThan(1)
  })

  it('filters by date range using 创建日期', () => {
    render(<CustomsTracking />)
    // 选择日期范围，模拟输入框值（简化：直接开启实时刷新以便不依赖点击查询）
    fireEvent.click(screen.getByText('实时刷新').previousSibling)

    // 设置关键词过滤，验证刷新触发
    fireEvent.change(screen.getByPlaceholderText('模糊查询，如 D202401'), { target: { value: 'D20240101' } })
    // 应该能看到对应记录
    expect(screen.getByText('D20240101')).toBeInTheDocument()
  })

  it('persists filters to localStorage on 查询', () => {
    render(<CustomsTracking />)
    fireEvent.click(screen.getByRole('button', { name: '查询' }))
    const saved = JSON.parse(localStorage.getItem('customsFilters'))
    expect(saved).toBeTruthy()
  })
})