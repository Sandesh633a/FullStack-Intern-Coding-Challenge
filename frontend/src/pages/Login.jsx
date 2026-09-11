import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success('Welcome back!');
      const dest = { admin: '/admin/dashboard', user: '/stores', store_owner: '/owner/dashboard' }[user.role] || '/stores';
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: 'admin@storerating.com', password: 'Admin@12345' });

  return (
    <div className="auth-bg min-h-[100dvh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[420px]">

        <div className="text-center mb-7 sm:mb-8">
          <div className="brand-mark mx-auto mb-4 h-11 w-11 rounded-xl" aria-hidden="true" />
          <h1 className="text-2xl font-bold font-[var(--font-display)] text-[#1A2530]">Sign in</h1>
          <p className="text-sm text-[#8AA4B4] mt-1">Your store feedback workspace</p>
        </div>

        <div className="auth-card bg-white rounded-2xl border border-[#D6E8EE] p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={form.email}
              onChange={set('email')}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={form.password}
              onChange={set('password')}
              required
            />

            {error && (
              <div className="flex items-center gap-2 p-3 bg-[#C0392B0A] border border-[#C0392B20] rounded-xl">
                <AlertCircle size={14} className="text-[#C0392B] flex-shrink-0" />
                <p className="text-xs text-[#C0392B]">{error}</p>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#EEF5F8] text-center">
            <p className="text-xs text-[#8AA4B4]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#8A2B3E] hover:text-[#6D1F30] font-semibold transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fillDemo}
          className="w-full mt-4 p-3 bg-white/70 hover:bg-white border border-[#D6E8EE] hover:border-[#B9D6DE] rounded-xl transition-all text-center"
        >
          <p className="text-xs leading-relaxed text-[#8AA4B4]">
            Demo admin:{' '}
            <span className="text-[#8A2B3E] font-semibold font-mono">admin@storerating.com</span>
            <span className="mx-1.5 text-[#D6E8EE]">·</span>
            <span className="text-[#8A2B3E] font-semibold font-mono">Admin@12345</span>
            <span className="ml-1 text-[#B9D6DE]">(click to fill)</span>
          </p>
        </button>
      </div>
    </div>
  );
}
