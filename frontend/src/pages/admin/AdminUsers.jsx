import { useEffect, useState, useCallback } from 'react';
import api from '../../lib/api';
import {
  Card, Badge, Table, Button, Modal, Input, Select,
  SearchBar, Spinner, EmptyState
} from '../../components/ui';
import {
  Users, Plus, ChevronUp, ChevronDown,
  User, Mail, MapPin, Lock, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

const ROLE_OPTIONS = [
  { value: '',            label: 'All Roles' },
  { value: 'admin',       label: 'Admin' },
  { value: 'user',        label: 'User' },
  { value: 'store_owner', label: 'Store Owner' },
];

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date joined' },
  { value: 'name',       label: 'Name' },
  { value: 'email',      label: 'Email' },
];

export default function AdminUsers() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [role, setRole]           = useState('');
  const [sortBy, setSortBy]       = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [showCreate, setShowCreate] = useState(false);
  const [viewUser, setViewUser]   = useState(null);
  const [creating, setCreating]   = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [formErrors, setFormErrors] = useState({});

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('name', search);
      if (role)   params.set('role', role);
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.data.users);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [search, role, sortBy, sortOrder]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleSort = (field) => {
    if (sortBy === field) setSortOrder(o => o === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setSortOrder('ASC'); }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreating(true); setFormErrors({});
    try {
      await api.post('/admin/users', form);
      toast.success('User created!');
      setShowCreate(false);
      setForm({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      const apiErrs = err.response?.data?.errors || [];
      if (apiErrs.length > 0) {
        const map = {};
        apiErrs.forEach(e => { map[e.field] = e.message; });
        setFormErrors(map);
      } else {
        toast.error(err.response?.data?.message || 'Failed to create user');
      }
    } finally { setCreating(false); }
  };

  const handleViewUser = async (id) => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setViewUser(res.data.data.user);
    } catch { toast.error('Failed to load user'); }
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
          Name <SortIcon field="name" />
        </button>
      ),
      render: (v) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#8A2B3E] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
            {v?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
          </div>
          <span className="font-semibold text-[#1A2530] truncate max-w-[160px]">{v}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: (
        <button onClick={() => toggleSort('email')} className="flex items-center gap-1 hover:text-[#1A2530]">
          Email <SortIcon field="email" />
        </button>
      ),
      render: (v) => <span className="text-[#52697A] text-xs">{v}</span>,
    },
    {
      key: 'address', label: 'Address',
      render: (v) => <span className="text-[#52697A] text-xs truncate max-w-[160px] block">{v || '—'}</span>,
    },
    {
      key: 'role', label: 'Role',
      render: (v) => <Badge variant={v}>{v.replace('_', ' ')}</Badge>,
    },
    {
      key: 'id', label: '',
      render: (v) => (
        <Button variant="muted" size="sm" onClick={() => handleViewUser(v)}>
          <Eye size={13} /> View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold font-[var(--font-display)] text-[#1A2530]">Users</h1>
          <p className="text-sm text-[#8AA4B4] mt-1">{users.length} registered users</p>
        </div>
        <Button variant="primary" className="w-full sm:w-auto" onClick={() => setShowCreate(true)}>
          <Plus size={15} /> Add User
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-end gap-3">
          <div className="flex-1 min-w-0 sm:min-w-[200px]">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by name…" />
          </div>
          <div className="w-full sm:w-40">
            <Select options={ROLE_OPTIONS} value={role} onChange={setRole} />
          </div>
          <div className="w-full sm:w-40">
            <Select options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
          </div>
          <Button
            variant="secondary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => setSortOrder(o => o === 'ASC' ? 'DESC' : 'ASC')}
          >
            {sortOrder === 'ASC' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span className="text-xs font-semibold">{sortOrder}</span>
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table columns={columns} data={users} loading={loading} emptyIcon={Users} emptyText="No users found" />
      </Card>

      {/* Create User Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add New User" width="max-w-lg">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input label="Full Name (20–60 chars)" placeholder="e.g. Jonathan Alexander Smith Jr" icon={User}
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={formErrors.name} required />
          <Input label="Email" type="email" placeholder="" icon={Mail} name="new-user-email" autoComplete="off"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={formErrors.email} required />
          <Input label="Password" type="password" placeholder="" icon={Lock} name="new-user-password" autoComplete="new-password"
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} error={formErrors.password} required />
          <Input label="Address" placeholder="Full address" icon={MapPin}
            value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} error={formErrors.address} required />
          <Select
            label="Role"
            options={[
              { value: 'user',        label: 'Normal User' },
              { value: 'admin',       label: 'Admin' },
              { value: 'store_owner', label: 'Store Owner' },
            ]}
            value={form.role}
            onChange={v => setForm(f => ({ ...f, role: v }))}
          />
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" variant="primary"   className="flex-1" loading={creating}>Create User</Button>
          </div>
        </form>
      </Modal>

      {/* View User Modal */}
      <Modal open={!!viewUser} onClose={() => setViewUser(null)} title="User Details">
        {viewUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#F7FAFB] rounded-xl border border-[#EEF5F8]">
              <div className="w-12 h-12 rounded-xl bg-[#8A2B3E] flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                {viewUser.name?.split(' ').slice(0, 2).map(n => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[#1A2530]">{viewUser.name}</p>
                <p className="text-xs text-[#52697A]">{viewUser.email}</p>
                <Badge variant={viewUser.role} className="mt-1">{viewUser.role.replace('_', ' ')}</Badge>
              </div>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5 p-3 bg-[#F7FAFB] rounded-xl">
                <MapPin size={14} className="text-[#B9D6DE] mt-0.5 flex-shrink-0" />
                <span className="text-[#52697A]">{viewUser.address || 'No address provided'}</span>
              </div>
              <p className="text-xs text-[#8AA4B4] px-1">
                Joined {new Date(viewUser.created_at).toLocaleDateString()}
              </p>
            </div>

            {viewUser.stores?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-[#8AA4B4] uppercase tracking-wide mb-2.5">Owned Stores</p>
                <div className="space-y-2">
                  {viewUser.stores.map(s => (
                    <div key={s.id} className="p-3.5 bg-[#F7FAFB] rounded-xl border border-[#EEF5F8]">
                      <p className="font-semibold text-sm text-[#1A2530]">{s.name}</p>
                      <p className="text-xs text-[#52697A] mt-0.5">{s.email}</p>
                      <p className="text-xs text-[#B85B72] mt-1.5 font-medium">
                        ★ {s.average_rating ? Number(s.average_rating).toFixed(1) : 'No ratings'}
                        <span className="text-[#8AA4B4] font-normal ml-1">({s.total_ratings} reviews)</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
