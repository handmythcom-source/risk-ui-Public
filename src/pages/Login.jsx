import React from 'react'
import { Card, Form, Input, Button, Typography, Space } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Title, Text } = Typography

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const onFinish = (values) => {
    const { username, password } = values
    // 简易校验，可替换为后端API
    if ((username === 'admin' && password === '123456') || (username === 'user' && password === '123456')) {
      localStorage.setItem('token', 'demo-token')
      localStorage.setItem('currentUser', JSON.stringify({ username, role: username === 'admin' ? '管理员' : '业务员' }))
      navigate(from, { replace: true })
    } else {
      alert('用户名或密码错误：admin/123456 或 user/123456')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #e6f7ff 0%, #f8fbff 100%)' }}>
      <Card style={{ width: 420 }}>
        <Space direction="vertical" style={{ width: '100%' }} align="center">
          <Title level={3} style={{ marginBottom: 4 }}>风险预警管控系统</Title>
          <Text type="secondary">请登录以进入系统</Text>
        </Space>
        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="admin 或 user" allowClear />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="123456" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>登录</Button>
        </Form>
      </Card>
    </div>
  )
}