import React, { useEffect, useState } from 'react'
import { Layout, Menu, Button, Space, Typography, Avatar } from 'antd'
import {
  DashboardOutlined,
  ApartmentOutlined,
  ProfileOutlined,
  CarOutlined,
  DollarOutlined,
  AlertOutlined,
  SettingOutlined,
  UserOutlined,
  ClusterOutlined,
  FundOutlined,
} from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const { Header, Sider, Content } = Layout
const { Title } = Typography

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '风险全景',
    path: '/',
  },
  {
    key: 'factory',
    icon: <ApartmentOutlined />,
    label: '工厂管理',
    children: [
      { key: 'factories', label: '工厂列表', path: '/factories', icon: <ProfileOutlined /> },
    ],
  },
  {
    key: 'customs',
    icon: <CarOutlined />,
    label: '报关跟踪',
    children: [
      { key: 'customs-list', label: '报关单列表', path: '/customs', icon: <ProfileOutlined /> },
      { key: 'customs-analytics', label: '时效分析', path: '/customs/analytics', icon: <FundOutlined /> },
    ],
  },
  {
    key: 'rebate',
    icon: <DollarOutlined />,
    label: '退税风险',
    children: [
      { key: 'rebates', label: '退税记录', path: '/rebates', icon: <ProfileOutlined /> },
      { key: 'rebates-analytics', label: '周期分析', path: '/rebates/analytics', icon: <FundOutlined /> },
    ],
  },
  {
    key: 'risk',
    icon: <AlertOutlined />,
    label: '风险中心',
    children: [
      { key: 'risks', label: '预警队列', path: '/risks', icon: <AlertOutlined /> },
      { key: 'workorders', label: '工单闭环', path: '/risks/workorders', icon: <ClusterOutlined /> },
    ],
  },
  {
    key: 'config',
    icon: <SettingOutlined />,
    label: '规则与配置',
    children: [
      { key: 'rules', label: '规则管理', path: '/rules', icon: <ProfileOutlined /> },
      { key: 'settings', label: '系统设置', path: '/settings', icon: <SettingOutlined /> },
      { key: 'users', label: '用户管理', path: '/users', icon: <UserOutlined /> },
    ],
  },
]

function findOpenKeys(pathname) {
  const matched = menuItems.find((m) => m.children?.some((c) => c.path === pathname))
  return matched ? [matched.key] : []
}

function findSelectedKey(pathname) {
  if (pathname === '/') return ['dashboard']
  for (const m of menuItems) {
    const child = m.children?.find((c) => c.path === pathname)
    if (child) return [child.key]
  }
  return []
}

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [systemName, setSystemName] = useState('风险预警管控系统')
  const [logo, setLogo] = useState(null)

  useEffect(() => {
    const s = localStorage.getItem('systemSettings')
    if (s) {
      try {
        const parsed = JSON.parse(s)
        setSystemName(parsed.systemName || '风险预警管控系统')
        setLogo(parsed.logoBase64 || null)
      } catch {}
    }
  }, [])

  const onMenuClick = (e) => {
    const target = menuItems
      .flatMap((m) => (m.children ? m.children : [m]))
      .find((it) => it.key === e.key)
    if (target?.path) navigate(target.path)
  }

  const selectedKeys = findSelectedKey(location.pathname)
  const openKeys = findOpenKeys(location.pathname)

  const menuData = menuItems.map((m) =>
    m.children
      ? { key: m.key, icon: m.icon, label: m.label, children: m.children.map((c) => ({ key: c.key, label: c.label, icon: c.icon })) }
      : { key: m.key, icon: m.icon, label: m.label }
  )

  const onLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <Layout className="app-shell" style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light" width={280} style={{ borderRight: '1px solid #eef2f5' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px', gap: 12 }}>
          {logo ? (
            <Avatar shape="square" size={36} src={logo} />
          ) : (
            <Avatar shape="square" size={36} style={{ background: '#0EA5E9' }}>LOGO</Avatar>
          )}
          {!collapsed && <Title level={5} style={{ margin: 0 }}>{systemName}</Title>}
        </div>
        <Menu
          mode="inline"
          items={menuData}
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys}
          onClick={onMenuClick}
        />
      </Sider>
      <Layout>
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space>
              <Title level={4} style={{ margin: 0 }}>{systemName}</Title>
            </Space>
            <Space>
              <Button type="text" onClick={() => navigate('/settings')}>系统设置</Button>
              <Button type="primary" onClick={onLogout}>退出登录</Button>
            </Space>
          </div>
        </Header>
        <Content className="app-container">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}