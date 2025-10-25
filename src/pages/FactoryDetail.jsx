import React, { useEffect, useState } from 'react'
import { Card, Descriptions, Row, Col, Image, List, Tag, Spin, Alert } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { getFactoryDetail } from '../services/factoryApi'

export default function FactoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')
    getFactoryDetail(id)
      .then((res) => {
        if (!mounted) return
        setData(res)
      })
      .catch((e) => setError(e.message || '加载失败'))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [id])

  return (
    <div className="content-page">
      <Row gutter={16}>
        <Col span={24}>
          <Card title={`工厂详情 - ${id}`} extra={<a onClick={() => navigate(-1)}>返回</a>}>
            {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 8 }} />}
            <Spin spinning={loading}>
              {data && (
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="工厂基本信息">
                      <Descriptions column={1}>
                        <Descriptions.Item label="名称">{data.basic.name}</Descriptions.Item>
                        <Descriptions.Item label="地址">{data.basic.address}</Descriptions.Item>
                        <Descriptions.Item label="联系方式">{data.basic.contact}</Descriptions.Item>
                        <Descriptions.Item label="电话">{data.basic.phone}</Descriptions.Item>
                        <Descriptions.Item label="邮箱">{data.basic.email}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="生产能力信息">
                      <Descriptions column={1}>
                        <Descriptions.Item label="设备数量">{data.capacity.equipmentCount}</Descriptions.Item>
                        <Descriptions.Item label="员工规模">{data.capacity.employees}</Descriptions.Item>
                        <Descriptions.Item label="月产能">{data.capacity.capacity.monthly}</Descriptions.Item>
                        <Descriptions.Item label="日产能">{data.capacity.capacity.daily}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Card title="资质认证信息">
                      <List dataSource={data.certifications} renderItem={(c) => <List.Item><Tag color="blue">{c}</Tag></List.Item>} />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="合作客户案例">
                      <List dataSource={data.customers} renderItem={(c) => <List.Item>
                        <List.Item.Meta title={c.name} description={c.case} />
                      </List.Item>} />
                    </Card>
                  </Col>

                  <Col span={24}>
                    <Card title="工厂实景照片展示">
                      <Row gutter={[8, 8]}>
                        {data.gallery.map((src, idx) => (
                          <Col key={idx} xs={12} sm={8} md={6} lg={4}>
                            <Image src={src} alt={`factory-${idx}`} width="100%" />
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </Col>
                </Row>
              )}
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  )
}