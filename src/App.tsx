import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HomePage from './components/pages/HomePage'
import ProductionPlanningPage from './components/pages/ProductionPlanningPage'
import ActualConsumptionPage from './components/pages/ActualConsumptionPage'
import InventoryPredictionPage from './components/pages/InventoryPredictionPage'
import ReportsPage from './components/pages/ReportsPage'
import AlertsPage from './components/pages/AlertsPage'
import InventoryPage from './components/pages/InventoryPage'
import OrdersPage from './components/pages/OrdersPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/"                     element={<HomePage />} />
        <Route path="/production-planning"  element={<ProductionPlanningPage />} />
        <Route path="/actual-consumption"   element={<ActualConsumptionPage />} />
        <Route path="/inventory-prediction" element={<InventoryPredictionPage />} />
        <Route path="/reports"              element={<ReportsPage />} />
        <Route path="/alerts"               element={<AlertsPage />} />
        <Route path="/inventory"            element={<InventoryPage />} />
        <Route path="/orders"              element={<OrdersPage />} />
      </Routes>
    </>
  )
}
