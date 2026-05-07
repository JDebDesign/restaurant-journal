import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-cream)' }}>
        <div className="text-sm" style={{ color: 'var(--color-charcoal-light)' }}>Loading…</div>
      </div>
    );
  }

  if (!session) return <Navigate to="/auth" replace />;

  return <>{children}</>;
}
