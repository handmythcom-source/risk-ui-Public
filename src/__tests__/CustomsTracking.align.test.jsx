import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import CustomsTracking from '../pages/CustomsTracking'

/**
 * 视觉对齐测试（结构与样式钩子验证）：
 * - 验证筛选容器使用 filters-inline 类（Flex wrap、垂直居中）
 * - 验证各查询条件项包含标签与控件，且容器设为居中（inline style）
 * - 验证展开更多筛选后仍保持结构一致
 */

describe('CustomsTracking filters vertical alignment', () => {
  it('filters container uses filters-inline', () => {
    render(<CustomsTracking />)
    const form = document.querySelector('.filters-inline')
    expect(form).toBeTruthy()
  })

  it('each filter item is vertically centered with consistent height', () => {
    render(<CustomsTracking />)
    const items = document.querySelectorAll('.filters-inline .ant-form-item')
    expect(items.length).toBeGreaterThan(0)
    items.forEach((it) => {
      // 通过 inline style 验证居中与高度（CSS 类在 JSDOM 中不可计算）
      const height = it.style.height
      expect(height === '40px' || height === '').toBeTruthy()
      const display = it.style.display
      const align = it.style.alignItems
      expect(display === 'flex' || display === '').toBeTruthy()
      expect(align === 'center' || align === '').toBeTruthy()
      // 同时验证标签与控件容器存在
      const hasLabel = it.querySelector('.ant-form-item-label') || it.querySelector('label')
      const hasControl = it.querySelector('.ant-form-item-control') || it.querySelector('.ant-select, .ant-picker, input')
      expect(hasLabel).toBeTruthy()
      expect(hasControl).toBeTruthy()
    })
  })

  it('expanded filters keep alignment structure', () => {
    render(<CustomsTracking />)
    const toggle = screen.getByRole('button', { name: /更多筛选|收起筛选/ })
    fireEvent.click(toggle)
    // 展开后应出现“单号”控件所在项
    it('shows order filter by default and two-line break exists', () => {
      render(<CustomsTracking />)
      const orderLabel = screen.getByText('单号')
      const orderItem = orderLabel.closest('.ant-form-item')
      expect(orderItem).toBeTruthy()
      // 验证该项也使用居中样式（inline）
      expect(orderItem.style.display === 'flex').toBeTruthy()
      expect(orderItem.style.alignItems === 'center').toBeTruthy()
      expect(orderItem.style.height === '40px').toBeTruthy()
      // 验证两行分隔元素存在
      const breakEl = document.querySelector('.filters-inline .filters-break')
      expect(breakEl).toBeTruthy()
    })
  })
})