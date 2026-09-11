import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Store, LogOut, Settings, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

const navItems = {
  admin: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/stores', icon: Store, label: 'Stores' },
  ],
  user: [{ to: '/stores', icon: Store, label: 'Browse stores' }],
  store_owner: [{ to: '/owner/dashboard', icon: LayoutDashboard, label: 'Store overview' }],
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = navItems[user?.role] || [];
  const handleLogout = () => { logout(); navigate('/login'); };

  const navClass = ({ isActive }) => `
    flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150
    ${isActive
      ? 'bg-[#8A2B3E0D] text-[#8A2B3E] shadow-[inset_3px_0_0_#8A2B3E]'
      : 'text-[#52697A] hover:bg-[#F1FBFF] hover:text-[#1A2530]'}
    ${collapsed ? 'justify-center' : ''}
  `;

  return (
    <div className="app-shell flex h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#F1FBFF]">
      {mobileOpen && <div className="fixed inset-0 z-30 bg-[#1A2530]/25 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />}

      <aside className={`fixed md:relative z-40 flex h-full flex-col border-r border-[#D6E8EE] bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${collapsed ? 'w-[72px]' : 'w-[248px]'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className={`flex items-center border-b border-[#EEF5F8] ${collapsed ? 'justify-center px-3 py-6' : 'px-6 py-6'}`}>
          {collapsed ? (
            <div className="brand-mark brand-mark--compact" aria-label="StoreRating" />
          ) : (
            <div className="flex items-center gap-3">
              <div className="brand-mark" aria-hidden="true" />
              <p className="text-[15px] font-bold tracking-[-0.02em] text-[#1A2530] font-[var(--font-display)]">StoreRating</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {!collapsed && <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8AA4B4]">Workspace</p>}
          {items.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={navClass} title={collapsed ? label : undefined}>
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-[#EEF5F8] px-3 py-4">
          <NavLink to="/settings" onClick={() => setMobileOpen(false)} className={navClass} title={collapsed ? 'Settings' : undefined}>
            <Settings size={16} className="shrink-0" />
            {!collapsed && <span>Settings</span>}
          </NavLink>
          <button onClick={handleLogout} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#52697A] transition-all hover:bg-[#C0392B0A] hover:text-[#C0392B] ${collapsed ? 'justify-center' : ''}`} title={collapsed ? 'Sign out' : undefined}>
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>

        <button onClick={() => setCollapsed(value => !value)} aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'} className="absolute -right-3 top-[74px] hidden h-6 w-6 items-center justify-center rounded-full border border-[#D6E8EE] bg-white text-[#8AA4B4] shadow-sm transition-all hover:border-[#B9D6DE] hover:text-[#1A2530] md:flex">
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex min-h-[60px] items-center gap-3 border-b border-[#EEF5F8] bg-white px-4 py-3 md:hidden">
          <button onClick={() => setMobileOpen(value => !value)} aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D6E8EE] bg-[#F1FBFF] text-[#52697A]">
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <div className="flex min-w-0 items-center gap-2"><div className="brand-mark brand-mark--compact" aria-hidden="true" /><span className="truncate text-sm font-bold text-[#1A2530] font-[var(--font-display)]">StoreRating</span></div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="page-enter mx-auto w-full max-w-screen-2xl p-5 sm:p-8 lg:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
