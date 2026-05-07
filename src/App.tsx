import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AuthGuard } from './components/AuthGuard';
import { useAuth } from './lib/auth-context';
import Dashboard from './pages/Dashboard';
import NewEntry from './pages/NewEntry';
import EditEntry from './pages/EditEntry';
import EntryDetailPage from './pages/EntryDetail';
import Auth from './pages/Auth';
import HomePage from './pages/HomePage';

function RootRoute() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-cream)' }}>
        <div className="text-sm" style={{ color: 'var(--color-charcoal-light)' }}>Loading…</div>
      </div>
    );
  }
  if (!session) return <HomePage />;
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Dashboard />
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)' }}>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<RootRoute />} />
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
