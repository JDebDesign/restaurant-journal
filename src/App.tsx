import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AuthGuard } from './components/AuthGuard';
import Dashboard from './pages/Dashboard';
import NewEntry from './pages/NewEntry';
import EditEntry from './pages/EditEntry';
import EntryDetailPage from './pages/EntryDetail';
import Auth from './pages/Auth';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)' }}>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Navbar />
                <main className="max-w-5xl mx-auto px-4 py-8">
                  <Dashboard />
                </main>
              </AuthGuard>
            }
          />
          <Route
            path="/new"
            element={
              <AuthGuard>
                <Navbar />
                <main className="max-w-2xl mx-auto px-4 py-8">
                  <NewEntry />
                </main>
              </AuthGuard>
            }
          />
          <Route
            path="/entries/:id"
            element={
              <AuthGuard>
                <Navbar />
                <main className="max-w-2xl mx-auto px-4 py-8">
                  <EntryDetailPage />
                </main>
              </AuthGuard>
            }
          />
          <Route
            path="/entries/:id/edit"
            element={
              <AuthGuard>
                <Navbar />
                <main className="max-w-2xl mx-auto px-4 py-8">
                  <EditEntry />
                </main>
              </AuthGuard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
