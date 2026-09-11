import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Input, Button } from '../components/ui';
import { Lock, CheckCircle, AlertCircle, User, MapPin, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const passwordRules = [
  { label: 'At least 8 characters',  test: (p) => p.length >= 8 },
  { label: 'One uppercase letter',    test: (p) => /[A-Z]/.test(p) },
  { label: 'One special character',   test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export default function Settings() {
  const { user, changePassword } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) { setError('New passwords do not match'); return; }
    const failing = passwordRules.find(r => !r.test(form.newPassword));
    if (failing) { setError(failing.label); return; }
    setLoading(true);
    try {
      await changePassword(form.currentPassword, form.newPassword);
      toast.success('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const pwRules = passwordRules.map(r => ({ ...r, pass: r.test(form.newPassword) }));
  const initials = user?.name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <div className="max-w-2xl space-y-5 sm:space-y-6">

      <div className="mb-2">
        <h1 className="text-2xl font-bold font-[var(--font-display)] text-[#1A2530]">Settings</h1>
        <p className="text-sm text-[#8AA4B4] mt-1">Manage your account preferences</p>
      </div>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-bold text-[#1A2530] mb-5 uppercase tracking-wide">Profile Information</h2>

        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#8A2B3E] flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#1A2530] text-base truncate">{user?.name}</p>
            <p className="text-sm text-[#52697A] break-all">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-[#F7FAFB] rounded-xl border border-[#EEF5F8]">
            <Mail size={15} className="text-[#B9D6DE] mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-[#8AA4B4] uppercase tracking-wide mb-0.5">Email</p>
              <p className="text-sm text-[#1A2530] truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-[#F7FAFB] rounded-xl border border-[#EEF5F8]">
            <User size={15} className="text-[#B9D6DE] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-[#8AA4B4] uppercase tracking-wide mb-0.5">Role</p>
              <p className="text-sm text-[#1A2530] capitalize font-medium">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>

          {user?.address && (
            <div className="flex items-start gap-3 p-4 bg-[#F7FAFB] rounded-xl border border-[#EEF5F8] sm:col-span-2">
              <MapPin size={15} className="text-[#B9D6DE] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-[#8AA4B4] uppercase tracking-wide mb-0.5">Address</p>
                <p className="text-sm text-[#1A2530]">{user.address}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-bold text-[#1A2530] mb-5 uppercase tracking-wide">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={form.currentPassword}
            onChange={set('currentPassword')}
            required
          />

          <div>
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={form.newPassword}
              onChange={set('newPassword')}
              required
            />
            {form.newPassword.length > 0 && (
              <div className="mt-2.5 space-y-1.5 px-1">
                {pwRules.map(r => (
                  <div key={r.label} className="flex items-center gap-2">
                    <CheckCircle size={12} className={r.pass ? 'text-[#1F7A55]' : 'text-[#D6E8EE]'} />
                    <span className={`text-[11px] font-medium ${r.pass ? 'text-[#1F7A55]' : 'text-[#8AA4B4]'}`}>{r.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={form.confirm}
            onChange={set('confirm')}
            required
            error={form.confirm && form.confirm !== form.newPassword ? "Passwords don't match" : ''}
          />

          {error && (
            <div className="flex items-center gap-2 p-3 bg-[#C0392B0A] border border-[#C0392B20] rounded-xl">
              <AlertCircle size={14} className="text-[#C0392B] flex-shrink-0" />
              <p className="text-xs text-[#C0392B]">{error}</p>
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
}
