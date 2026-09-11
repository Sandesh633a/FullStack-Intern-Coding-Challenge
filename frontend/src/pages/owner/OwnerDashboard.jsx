import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Card, StatCard, StarDisplay, Badge, Spinner, EmptyState } from '../../components/ui';
import { Star, Users, BarChart2, Store, MapPin, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OwnerDashboard() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/owner/dashboard');
        setData(res.data.data.stores);
      } catch { toast.error('Failed to load dashboard'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size={36} />
    </div>
  );

  if (!data.length) return (
    <EmptyState
      icon={Store}
      title="No store assigned"
      description="Contact an admin to assign a store to your account."
    />
  );

  return (
    <div className="space-y-7 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-display)] text-[#1A2530]">Store Dashboard</h1>
        <p className="text-sm text-[#8AA4B4] mt-1">Overview of your store performance</p>
      </div>

      {data.map(store => (
        <StoreSection key={store.id} store={store} />
      ))}
    </div>
  );
}

function StoreSection({ store }) {
  const avgNum = store.average_rating ? Number(store.average_rating) : null;

  const dist = [1, 2, 3, 4, 5].map(n => ({
    n,
    count: store.raters.filter(r => r.rating === n).length,
  }));
  const maxCount = Math.max(...dist.map(d => d.count), 1);

  return (
    <div className="space-y-5 sm:space-y-6">

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-start sm:items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#B85B7215] border border-[#B85B7230] flex items-center justify-center flex-shrink-0">
                <Store size={18} className="text-[#B85B72]" />
              </div>
              <h2 className="text-lg font-bold font-[var(--font-display)] text-[#1A2530] truncate">{store.name}</h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 text-xs text-[#8AA4B4]">
              <span className="flex min-w-0 items-center gap-1">
                <Mail size={11} className="text-[#B9D6DE]" />
                <span className="truncate">{store.email}</span>
              </span>
              <span className="flex min-w-0 items-start gap-1">
                <MapPin size={11} className="text-[#B9D6DE]" />
                <span className="break-words">{store.address}</span>
              </span>
            </div>
          </div>

          <div className="flex self-start sm:self-auto items-center gap-3 p-4 bg-[#FFF8F9] border border-[#B85B7220] rounded-xl flex-shrink-0">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#B85B72] font-[var(--font-display)]">
                {avgNum ? avgNum.toFixed(1) : '—'}
              </p>
              <StarDisplay value={avgNum} size={13} />
              <p className="text-[10px] text-[#8AA4B4] mt-0.5 font-medium">Average</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard label="Avg Rating"    value={avgNum ? avgNum.toFixed(1) : '—'} icon={Star}     color="rose" />
        <StatCard label="Total Reviews" value={store.total_ratings}              icon={Users}    color="mist" />
        <StatCard label="Rating Score"  value={avgNum ? `${Math.round(avgNum * 20)}%` : '—'} icon={BarChart2} color="crimson" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card className="p-5">
          <h3 className="text-sm font-bold text-[#1A2530] mb-5">Rating Distribution</h3>
          <div className="space-y-3">
            {dist.reverse().map(({ n, count }) => (
              <div key={n} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-10 flex-shrink-0">
                  <span className="text-xs font-semibold text-[#52697A]">{n}</span>
                  <Star size={11} fill="#B85B72" className="text-[#B85B72]" />
                </div>
                <div className="flex-1 bg-[#F1FBFF] rounded-full h-2.5 overflow-hidden border border-[#EEF5F8]">
                  <div
                    className="h-full bg-[#B85B72] rounded-full transition-all duration-700"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-[#8AA4B4] w-5 text-right font-medium">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="px-5 pt-5 pb-3 border-b border-[#F1FBFF]">
            <h3 className="text-sm font-bold text-[#1A2530]">Customer Reviews</h3>
            <p className="text-xs text-[#8AA4B4] mt-0.5">{store.raters.length} customers rated your store</p>
          </div>

          {store.raters.length === 0 ? (
            <EmptyState icon={Star} title="No reviews yet" description="Share your store with customers to get your first rating." />
          ) : (
            <div className="divide-y divide-[#F1FBFF] max-h-64 overflow-y-auto">
              {store.raters.map(r => (
                <div key={r.rating_id} className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 hover:bg-[#F7FAFB] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#8A2B3E] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                      {r.user_name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1A2530] truncate">{r.user_name}</p>
                      <p className="text-xs text-[#8AA4B4] truncate">{r.user_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <StarDisplay value={r.rating} size={13} />
                    <span className="text-[10px] text-[#8AA4B4] hidden sm:block">
                      {new Date(r.rated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
