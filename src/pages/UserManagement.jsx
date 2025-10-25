import React, { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, Tag } from 'antd'

const initial = [
  { id: 1, username: 'admin', role: '管理员', status: '启用' },
  { id: 2, username: 'user', role: '业务员', status: '启用' },
]

export default function UserManagement() {
  const [data, setData] = useState(initial)
  const [visible, setVisible] = useState(false)

  const columns = [
    { title: '用户名', dataIndex: 'username' },
    { title: '角色', dataIndex: 'role', render: (r) => <Tag color={r === '管理员' ? 'blue' : 'green'}>{r}</Tag> },
    { title: '状态', dataIndex: 'status', render: (s) => <Tag color={s === '启用' ? 'green' : 'red'}>{s}</Tag> },
  ]

  const onAdd = (values) => {
    setData((arr) => [...arr, { id: Date.now(), ...values }])
    setVisible(false)
  }

  return (
    <div className="content-page">
      <Card title="用户管理" extra={<Button type="primary" onClick={() => setVisible(true)}>新增用户</Button>}>
        <Table rowKey="id" columns={columns} dataSource={data} />
        <Modal title="新增用户" open={visible} onCancel={() => setVisible(false)} footer={null}>
          <Form layout="vertical" onFinish={onAdd}>
            <Form.Item name="username" label="用户名" rules={[{ required: true }]}> <Input /> </Form.Item>
            <Form.Item name="role" label="角色" rules={[{ required: true }]}> <Select options={[{value:'管理员', label:'管理员'},{value:'风控', label:'风控'},{value:'业务员', label:'业务员'}]} /> </Form.Item>
            <Form.Item name="status" label="状态" initialValue="启用" rules={[{ required: true }]}> <Select options={[{value:'启用', label:'启用'},{value:'停用', label:'停用'}]} /> </Form.Item>
            <Button type="primary" htmlType="submit" block>保存</Button>
          </Form>
        </Modal>
      </Card>
    </div>
  )
}