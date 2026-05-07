import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth-context';

export function Navbar() {
  const { session } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate('/auth');
  }

  return (
    <header
      className="border-b px-4 py-3"
      style={{ borderColor: 'var(--color-sand-dark)', backgroundColor: 'white' }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="font-serif font-semibold text-xl"
          style={{ color: 'var(--color-charcoal)' }}
        >
          Restaurant Journal
        </Link>

        <div className="flex items-center gap-3">
          {session && (
            <>
              <Link
                to="/new"
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-terracotta)' }}
              >
                + New Entry
              </Link>
              <button
                onClick={signOut}
                className="text-sm transition-colors"
                style={{ color: 'var(--color-charcoal-light)' }}
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
