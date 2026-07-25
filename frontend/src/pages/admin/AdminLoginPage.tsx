import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/services/apiClient';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@brothersphotographyj.com');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch<{ token: string; email: string; role: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('cms_admin_token', data.token);
      localStorage.setItem('cms_admin_email', data.email);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      // Direct mock/demo OAuth token login
      const data = await apiFetch<{ token: string; email: string; role: string }>(
        `/auth/google?email=${encodeURIComponent('admin@brothersphotographyj.com')}&name=Admin+Google`,
        { method: 'POST' },
      );
      localStorage.setItem('cms_admin_token', data.token);
      localStorage.setItem('cms_admin_email', data.email);
      navigate('/admin');
    } catch (err: any) {
      setError('Google login failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-light tracking-wide text-zinc-100">
            CMS Admin Portal
          </h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-zinc-400">
            Stories by Joseph Radhik
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-center text-xs text-red-400">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-gold"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-gold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-950 transition hover:bg-yellow-500 disabled:opacity-50"
          >
            {loading ? 'Authenticating…' : 'Sign In to CMS'}
          </button>
        </form>

        <div className="relative my-6 text-center text-xs text-zinc-500">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <span className="relative bg-zinc-900 px-3 uppercase tracking-widest">Or</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-700 bg-zinc-950 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-200 transition hover:border-zinc-500"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Sign In with Google OAuth 2.0
        </button>
      </div>
    </div>
  );
}
