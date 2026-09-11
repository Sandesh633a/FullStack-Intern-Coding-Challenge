import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
import { Mail, Lock, User, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const passwordRules = [
  { label: 'At least 8 characters',  test: (p) => p.length >= 8 },
  { label: 'One uppercase letter',    test: (p) => /[A-Z]/.test(p) },
  { label: 'One special character',   test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: '' }));
    setGlobalError('');
  };

  const validate = () => {
    const errs = {};
    if (form.name.length < 20)  errs.name = 'Name must be at least 20 characters';
    if (form.name.length > 60)  errs.name = 'Name must be at most 60 characters';
    if (!form.email.includes('@')) errs.email = 'Valid email required';
    if (form.password.length < 8)  errs.password = 'At least 8 characters required';
    if (!/[A-Z]/.test(form.password)) errs.password = 'Include at least one uppercase letter';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) errs.password = 'Include at least one special character';
    if (!form.address.trim()) errs.address = 'Address is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/stores', { replace: true });
    } catch (err) {
      const apiErrs = err.response?.data?.errors || [];
      if (apiErrs.length > 0) {
        const map = {};
        apiErrs.forEach(e => { map[e.field] = e.message; });
        setErrors(map);
      } else {
        setGlobalError(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const nameLen   = form.name.length;
  const pwRules   = passwordRules.map(r => ({ ...r, pass: r.test(form.password) }));
  const nameColor = nameLen === 0 ? 'text-[#8AA4B4]' : nameLen < 20 ? 'text-[#C0392B]' : nameLen > 60 ? 'text-[#C0392B]' : 'text-[#1F7A55]';

  return (
    <div className="auth-bg min-h-[100dvh] flex items-center justify-center p-4 py-8 sm:p-6">
      <div className="w-full max-w-[440px]">

        <div className="text-center mb-7">
          <div className="brand-mark mx-auto mb-4 h-11 w-11 rounded-xl" aria-hidden="true" />
          <h1 className="text-2xl font-bold font-[var(--font-display)] text-[#1A2530]">Create account</h1>
          <p className="text-sm text-[#8AA4B4] mt-1">Start collecting better store feedback</p>
        </div>

        <div className="auth-card bg-white rounded-2xl border border-[#D6E8EE] p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <Input
                label="Full name"
                type="text"
                placeholder="Your full legal name (min 20 chars)"
                icon={User}
                value={form.name}
                onChange={set('name')}
                error={errors.name}
                required
              />
              <div className="flex justify-end mt-1.5">
                <span className={`text-[11px] font-medium ${nameColor}`}>{nameLen}/60</span>
              </div>
            </div>

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={form.password}
                onChange={set('password')}
                error={errors.password}
                required
              />
              {form.password.length > 0 && (
                <div className="mt-2.5 space-y-1.5 px-1">
                  {pwRules.map(r => (
                    <div key={r.label} className="flex items-center gap-2">
                      <CheckCircle
                        size={12}
                        className={r.pass ? 'text-[#1F7A55]' : 'text-[#D6E8EE]'}
                      />
                      <span className={`text-[11px] font-medium ${r.pass ? 'text-[#1F7A55]' : 'text-[#8AA4B4]'}`}>
                        {r.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Input
              label="Address"
              type="text"
              placeholder="Your full address"
              icon={MapPin}
              value={form.address}
              onChange={set('address')}
              error={errors.address}
              required
            />

            {globalError && (
              <div className="flex items-center gap-2 p-3 bg-[#C0392B0A] border border-[#C0392B20] rounded-xl">
                <AlertCircle size={14} className="text-[#C0392B] flex-shrink-0" />
                <p className="text-xs text-[#C0392B]">{globalError}</p>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#EEF5F8] text-center">
            <p className="text-xs text-[#8AA4B4]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#8A2B3E] hover:text-[#6D1F30] font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
