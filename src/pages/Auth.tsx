import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth-context';

type Mode = 'signin' | 'signup';

export default function Auth() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {
    if (session) navigate('/', { replace: true });
  }, [session, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    if (mode === 'signin') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        setError(err.message);
      } else {
        setSignedUp(true);
      }
    }
    setLoading(false);
  }

  const inputClass =
    'w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-shadow';
  const inputStyle = { borderColor: 'var(--color-sand-dark)', backgroundColor: 'white' };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
        style={{ color: 'var(--color-charcoal-light)' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to home
      </Link>
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-4xl font-bold" style={{ color: 'var(--color-charcoal)' }}>
            Restaurant Journal
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-charcoal-light)' }}>
            Your personal culinary diary
          </p>
        </div>

        <div
          className="rounded-2xl border p-6 shadow-sm space-y-5"
          style={{ borderColor: 'var(--color-sand-dark)', backgroundColor: 'white' }}
        >
          {signedUp ? (
            <div className="text-center space-y-3 py-4">
              <div className="text-3xl">✉️</div>
              <h2 className="font-serif font-semibold text-lg" style={{ color: 'var(--color-charcoal)' }}>
                Check your email
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-charcoal-light)' }}>
                We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
              </p>
              <button
                onClick={() => { setSignedUp(false); setMode('signin'); }}
                className="text-sm underline"
                style={{ color: 'var(--color-terracotta)' }}
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <div
                className="flex rounded-xl p-1"
                style={{ backgroundColor: 'var(--color-sand)' }}
              >
                {(['signin', 'signup'] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMode(m); setError(''); }}
                    className="flex-1 py-1.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: mode === m ? 'white' : 'transparent',
                      color: mode === m ? 'var(--color-charcoal)' : 'var(--color-charcoal-light)',
                      boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    {m === 'signin' ? 'Sign in' : 'Create account'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className={inputClass}
                  style={inputStyle}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  minLength={6}
                  className={inputClass}
                  style={inputStyle}
                />

                {error && (
                  <p className="text-xs px-3 py-2 rounded-lg" style={{ color: 'var(--color-terracotta)', backgroundColor: '#FEF2F0' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl font-medium text-sm text-white transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-terracotta)' }}
                >
                  {loading ? '…' : mode === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
