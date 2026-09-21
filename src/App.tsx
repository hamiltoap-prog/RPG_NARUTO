import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminPage } from './pages/AdminPage'

/** O manual traz o renderizador de markdown junto; só desce quando alguém abre. */
const RulesPage = lazy(() => import('./pages/RulesPage').then((m) => ({ default: m.RulesPage })))
import { Home } from './pages/Home'
import { ScenePage } from './pages/ScenePage'
import { TableRoute } from './pages/TableRoute'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/t/:code" element={<TableRoute />} />
          <Route path="/t/:code/mapa" element={<ScenePage />} />
          <Route
            path="/regras"
            element={
              <Suspense fallback={<p className="p-8 text-center text-orange-300/60">Abrindo o manual...</p>}>
                <RulesPage />
              </Suspense>
            }
          />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
