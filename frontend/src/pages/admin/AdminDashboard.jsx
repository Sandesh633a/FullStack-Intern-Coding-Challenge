import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { StatCard, Card, Badge, Table, Spinner } from '../../components/ui';
import { Users, Store, Star, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [recentUsers, setRecentUsers]   = useState([]);
  const [recentStores, setRecentStores] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, usersRes, storesRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/users?sortBy=created_at&sortOrder=DESC'),
          api.get('/admin/stores?sortBy=average_rating&sortOrder=DESC'),
        ]);
        setStats(dashRes.data.data.stats);
        setRecentUsers(usersRes.data.data.users.slice(0, 5));
        setRecentStores(storesRes.data.data.stores.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const userCols = [
    {
      key: 'name', label: 'Name',
      render: (v) => <span className="font-semibold text-[#1A2530]">{v}</span>,
    },
    {
      key: 'email', label: 'Email',
      render: (v) => <span className="text-[#52697A] text-xs">{v}</span>,
    },
    {
      key: 'role', label: 'Role',
      render: (v) => <Badge variant={v}>{v.replace('_', ' ')}</Badge>,
    },
  ];

  const storeCols = [
    {
      key: 'name', label: 'Store',
      render: (v) => <span className="font-semibold text-[#1A2530]">{v}</span>,
    },
    {
      key: 'average_rating', label: 'Rating',
      render: (v) => (
        <div className="flex items-center gap-1.5">
          <Star size={13} fill="#B85B72" className="text-[#B85B72] flex-shrink-0" />
          <span className="text-[#B85B72] font-semibold text-sm">{v ? Number(v).toFixed(1) : '—'}</span>
        </div>
      ),
    },
    {
      key: 'total_ratings', label: 'Reviews',
      render: (v) => <span className="text-[#8AA4B4] text-sm">{v}</span>,
    },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size={36} />
    </div>
  );

  return (
    <div className="space-y-7">

      <div>
        <h1 className="text-2xl font-bold font-[var(--font-display)] text-[#1A2530]">Dashboard</h1>
        <p className="text-sm text-[#8AA4B4] mt-1">Platform overview and quick stats</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard label="Total Users"   value={stats?.total_users   ?? '—'} icon={Users}       color="crimson" />
        <StatCard label="Total Stores"  value={stats?.total_stores  ?? '—'} icon={Store}       color="mist" />
        <StatCard label="Total Ratings" value={stats?.total_ratings ?? '—'} icon={Star}        color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-[#F1FBFF]">
            <div>
              <h2 className="text-sm font-bold text-[#1A2530]">Recent Users</h2>
              <p className="text-xs text-[#8AA4B4] mt-0.5">Latest registrations</p>
            </div>
            <a href="/admin/users" className="text-xs text-[#8A2B3E] hover:text-[#6D1F30] font-semibold transition-colors">
              View all →
            </a>
          </div>
          <Table columns={userCols} data={recentUsers} emptyText="No users yet" />
        </Card>

        <Card>
          <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-[#F1FBFF]">
            <div>
              <h2 className="text-sm font-bold text-[#1A2530]">Top Rated Stores</h2>
              <p className="text-xs text-[#8AA4B4] mt-0.5">By average rating</p>
            </div>
            <a href="/admin/stores" className="text-xs text-[#8A2B3E] hover:text-[#6D1F30] font-semibold transition-colors">
              View all →
            </a>
          </div>
          <Table columns={storeCols} data={recentStores} emptyText="No stores yet" />
        </Card>
      </div>
    </div>
  );
}
