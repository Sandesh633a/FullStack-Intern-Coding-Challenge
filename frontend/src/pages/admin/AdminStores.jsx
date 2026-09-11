import { useEffect, useState, useCallback } from 'react';
import api from '../../lib/api';
import {
  Card, Badge, Table, Button, Modal, Input, Select,
  SearchBar, StarDisplay, Spinner
} from '../../components/ui';
import {
  Store, Plus, ChevronUp, ChevronDown, Mail, MapPin, Star, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const SORT_OPTIONS = [
  { value: 'created_at',    label: 'Date created' },
  { value: 'name',          label: 'Name' },
  { value: 'email',         label: 'Email' },
  { value: 'average_rating',label: 'Average Rating' },
];

export default function AdminStores() {
  const [stores, setStores]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [sortBy, setSortBy]       = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating]   = useState(false);
  const [ownerUsers, setOwnerUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [formErrors, setFormErrors] = useState({});
  const [viewStore, setViewStore] = useState(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('name', search);
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);
      const res = await api.get(`/admin/stores?${params}`);
      setStores(res.data.data.stores);
    } catch { toast.error('Failed to load stores'); }
    finally { setLoading(false); }
  }, [search, sortBy, sortOrder]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const loadOwners = async () => {
    try {
      const res = await api.get('/admin/users?role=store_owner');
      setOwnerUsers(res.data.data.users);
    } catch {}
  };

  const handleOpenCreate = () => { loadOwners(); setShowCreate(true); };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreating(true); setFormErrors({});
    try {
      const payload = { ...form };
      if (!payload.owner_id) delete payload.owner_id;
      await api.post('/admin/stores', payload);
      toast.success('Store created!');
      setShowCreate(false);
      setForm({ name: '', email: '', address: '', owner_id: '' });
      fetchStores();
    } catch (err) {
      const apiErrs = err.response?.data?.errors || [];
      if (apiErrs.length > 0) {
        const map = {};
        apiErrs.forEach(e => { map[e.field] = e.message; });
        setFormErrors(map);
      } else {
        toast.error(err.response?.data?.message || 'Failed to create store');
      }
    } finally { setCreating(false); }
  };

  const toggleSort = (field) => {
    if (sortBy === field) setSortOrder(o => o === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setSortOrder('ASC'); }
  };

  const SortIcon = ({ field }) =>
    sortBy === field
      ? sortOrder === 'ASC'
        ? <ChevronUp size={13} className="text-[#8A2B3E]" />
        : <ChevronDown size={13} className="text-[#8A2B3E]" />
      : <ChevronUp size={13} className="text-[#D6E8EE]" />;

  const columns = [
    {
      key: 'name',
      label: (
        <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-[#1A2530]">
          Store <SortIcon field="name" />
        </button>
      ),
      render: (v, row) => (
        <div>
          <p className="font-semibold text-[#1A2530]">{v}</p>
          <p className="text-xs text-[#8AA4B4] mt-0.5">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'address', label: 'Address',
      render: (v) => <span className="text-[#52697A] text-xs truncate max-w-[160px] block">{v}</span>,
    },
    {
      key: 'owner_name', label: 'Owner',
      render: (v) => v
        ? <Badge variant="store_owner">{v}</Badge>
        : <span className="text-[#8AA4B4] text-xs">Unassigned</span>,
    },
    {
      key: 'average_rating',
      label: (
        <button onClick={() => toggleSort('average_rating')} className="flex items-center gap-1 hover:text-[#1A2530]">
          Rating <SortIcon field="average_rating" />
        </button>
      ),
      render: (v, row) => (
        <div className="flex items-center gap-2">
          <StarDisplay value={v} />
          <span className="text-xs text-[#8AA4B4]">({row.total_ratings})</span>
        </div>
      ),
    },
    {
      key: 'id', label: '',
      render: (v, row) => (
        <Button variant="muted" size="sm" onClick={() => setViewStore(row)}>
          <Info size={13} /> Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold font-[var(--font-display)] text-[#1A2530]">Stores</h1>
          <p className="text-sm text-[#8AA4B4] mt-1">{stores.length} registered stores</p>
        </div>
        <Button variant="primary" className="w-full sm:w-auto" onClick={handleOpenCreate}>
          <Plus size={15} /> Add Store
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-end gap-3">
          <div className="flex-1 min-w-0 sm:min-w-[200px]">
            <SearchBar value={search} onChange={setSearch} placeholder="Search stores…" />
          </div>
          <div className="w-full sm:w-48">
            <Select options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
          </div>
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setSortOrder(o => o === 'ASC' ? 'DESC' : 'ASC')}>
            {sortOrder === 'ASC' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span className="text-xs font-semibold">{sortOrder}</span>
          </Button>
        </div>
      </Card>

      <Card>
        <Table columns={columns} data={stores} loading={loading} emptyIcon={Store} emptyText="No stores yet" />
      </Card>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add New Store" width="max-w-lg">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input label="Store Name (20–60 chars)" placeholder="e.g. The Grand Coffee Emporium Shop" icon={Store}
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={formErrors.name} required />
          <Input label="Store Email" type="email" placeholder="store@example.com" icon={Mail}
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={formErrors.email} required />
          <Input label="Address" placeholder="Full store address" icon={MapPin}
            value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} error={formErrors.address} required />
          <Select
            label="Assign Owner (optional)"
            options={[
              { value: '', label: 'No owner' },
              ...ownerUsers.map(u => ({ value: u.id, label: u.name })),
            ]}
            value={form.owner_id}
            onChange={v => setForm(f => ({ ...f, owner_id: v }))}
          />
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" variant="primary"   className="flex-1" loading={creating}>Create Store</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!viewStore} onClose={() => setViewStore(null)} title="Store Details">
        {viewStore && (
          <div className="space-y-4">
            <div className="p-4 bg-[#F7FAFB] rounded-xl border border-[#EEF5F8]">
              <p className="font-bold text-[#1A2530] text-base">{viewStore.name}</p>
              <p className="text-xs text-[#52697A] mt-0.5">{viewStore.email}</p>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 p-3 bg-[#F7FAFB] rounded-xl">
                <MapPin size={14} className="text-[#B9D6DE] flex-shrink-0" />
                <span className="text-[#52697A]">{viewStore.address}</span>
              </div>
              {viewStore.owner_name && (
                <div className="flex items-center gap-2.5 p-3 bg-[#F7FAFB] rounded-xl">
                  <Store size={14} className="text-[#B9D6DE] flex-shrink-0" />
                  <span className="text-[#52697A]">
                    Owner: <span className="text-[#1A2530] font-semibold">{viewStore.owner_name}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 bg-[#FFF8F9] border border-[#B85B7225] rounded-xl text-center">
              <p className="text-4xl font-bold text-[#B85B72] font-[var(--font-display)] mb-2">
                {viewStore.average_rating ? Number(viewStore.average_rating).toFixed(1) : '—'}
              </p>
              <StarDisplay value={viewStore.average_rating} size={18} />
              <p className="text-xs text-[#8AA4B4] mt-2">{viewStore.total_ratings} ratings total</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
