import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminPage } from './pages/AdminPage'
import { Home } from './pages/Home'
import { TableRoute } from './pages/TableRoute'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/t/:code" element={<TableRoute />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
