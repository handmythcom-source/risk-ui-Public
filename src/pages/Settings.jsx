import React, { useEffect, useState } from 'react'
import { Card, Form, Input, Upload, Button, Avatar, Space, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}

export default function Settings() {
  const [form] = Form.useForm()
  const [logo, setLogo] = useState(null)

  useEffect(() => {
    const s = localStorage.getItem('systemSettings')
    if (s) {
      try {
        const parsed = JSON.parse(s)
        form.setFieldsValue({ systemName: parsed.systemName })
        setLogo(parsed.logoBase64 || null)
      } catch {}
    }
  }, [])

  const onSave = async () => {
    const values = form.getFieldsValue()
    const payload = { systemName: values.systemName || '风险预警管控系统', logoBase64: logo }
    localStorage.setItem('systemSettings', JSON.stringify(payload))
    message.success('设置已保存（本地存储）')
  }

  const uploadProps = {
    accept: 'image/*',
    maxCount: 1,
    showUploadList: false,
    beforeUpload: async (file) => {
      const base64 = await getBase64(file)
      setLogo(base64)
      message.success('LOGO已选择，保存后生效')
      return false
    },
  }

  return (
    <div className="content-page">
      <Card title="系统设置">
        <Space align="start" style={{ width: '100%' }}>
          <Avatar shape="square" size={80} src={logo} style={{ background: '#0EA5E9' }}>LOGO</Avatar>
          <Form layout="vertical" form={form} style={{ flex: 1 }}>
            <Form.Item name="systemName" label="系统名称" rules={[{ required: true, message: '请输入系统名称' }]}> <Input placeholder="风险预警管控系统" /> </Form.Item>
            <Form.Item label="系统LOGO"> <Upload {...uploadProps}> <Button icon={<UploadOutlined />}>上传LOGO</Button> </Upload> </Form.Item>
            <Button type="primary" onClick={onSave}>保存</Button>
          </Form>
        </Space>
      </Card>
    </div>
  )
}