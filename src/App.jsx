import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import RequireAuth from './components/RequireAuth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FactoryList from './pages/FactoryList'
import FactoryDetail from './pages/FactoryDetail'
import CustomsTracking from './pages/CustomsTracking'
import CustomsAnalytics from './pages/CustomsAnalytics'
import TaxRebate from './pages/TaxRebate'
import RebateAnalytics from './pages/RebateAnalytics'
import RiskCenter from './pages/RiskCenter'
import WorkOrders from './pages/WorkOrders'
import Rules from './pages/Rules'
import Settings from './pages/Settings'
import UserManagement from './pages/UserManagement'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="factories" element={<FactoryList />} />
        {/* 添加别名路由，满足 /factory/list 的跳转需求 */}
        <Route path="factory/list" element={<FactoryList />} />
        {/* 工厂详情双路由别名 */}
        <Route path="factory/:id" element={<FactoryDetail />} />
        <Route path="factories/:id" element={<FactoryDetail />} />
        <Route path="customs" element={<CustomsTracking />} />
        <Route path="customs/analytics" element={<CustomsAnalytics />} />
        <Route path="rebates" element={<TaxRebate />} />
        <Route path="rebates/analytics" element={<RebateAnalytics />} />
        <Route path="risks" element={<RiskCenter />} />
        <Route path="risks/workorders" element={<WorkOrders />} />
        <Route path="rules" element={<Rules />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users" element={<UserManagement />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
