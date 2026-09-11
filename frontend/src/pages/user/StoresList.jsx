import { useEffect, useState, useCallback } from 'react';
import api from '../../lib/api';
import {
  Card, StarDisplay, StarRating, Button, Modal,
  SearchBar, Select, Spinner, Badge, EmptyState
} from '../../components/ui';
import { Store, Star, MapPin, ChevronUp, ChevronDown, RefreshCw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SORT_OPTIONS = [
  { value: 'name',           label: 'Name (A-Z)' },
  { value: 'average_rating', label: 'Top Rated' },
];

export default function StoresList() {
  const [stores, setStores]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [sortBy, setSortBy]       = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [ratingStore, setRatingStore] = useState(null);
  const [newRating, setNewRating]     = useState(0);
  const [submitting, setSubmitting]   = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('name', search);
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);
      const res = await api.get(`/stores?${params}`);
      setStores(res.data.data.stores);
    } catch { toast.error('Failed to load stores'); }
    finally { setLoading(false); }
  }, [search, sortBy, sortOrder]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const openRating = (store) => {
    setRatingStore(store);
    setNewRating(store.user_rating || 0);
  };

  const handleSubmitRating = async () => {
    if (!newRating) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      if (ratingStore.user_rating) {
        await api.patch(`/ratings/${ratingStore.id}`, { rating: newRating });
        toast.success('Rating updated!');
      } else {
        await api.post(`/ratings/${ratingStore.id}`, { rating: newRating });
        toast.success('Rating submitted!');
      }
      setRatingStore(null);
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold font-[var(--font-display)] text-[#1A2530]">Browse Stores</h1>
        <p className="text-sm text-[#8AA4B4] mt-1">Discover and rate stores near you</p>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
        <div className="flex-1 min-w-0 sm:min-w-[220px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search stores…" />
        </div>
        <div className="w-full sm:w-44">
          <Select
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={v => { setSortBy(v); setSortOrder(v === 'average_rating' ? 'DESC' : 'ASC'); }}
          />
        </div>
        <Button variant="secondary" size="md" className="w-full sm:w-auto" onClick={fetchStores} title="Refresh" aria-label="Refresh stores">
          <RefreshCw size={14} />
        </Button>
      </div>

      {!loading && (
        <p className="text-xs text-[#8AA4B4] font-medium">
          {stores.length} {stores.length === 1 ? 'store' : 'stores'} found
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 rounded-2xl shimmer" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <EmptyState icon={Store} title="No stores found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stores.map(store => (
            <StoreCard key={store.id} store={store} onRate={openRating} />
          ))}
        </div>
      )}

      <Modal
        open={!!ratingStore}
        onClose={() => setRatingStore(null)}
        title={ratingStore?.user_rating ? 'Update Your Rating' : 'Rate This Store'}
      >
        {ratingStore && (
          <div className="space-y-5">
            <div className="p-4 bg-[#F7FAFB] rounded-xl border border-[#EEF5F8]">
              <p className="font-bold text-[#1A2530]">{ratingStore.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={12} className="text-[#B9D6DE] flex-shrink-0" />
                <p className="text-xs text-[#52697A]">{ratingStore.address}</p>
              </div>
            </div>

            <div className="text-center py-2">
              <p className="text-sm text-[#52697A] mb-4 font-medium">
                {ratingStore.user_rating
                  ? `Current rating: ${ratingStore.user_rating}/5 — update below`
                  : 'How would you rate this store?'}
              </p>
              <div className="flex justify-center">
                <StarRating value={newRating} onChange={setNewRating} />
              </div>
              <p className="text-xs text-[#8AA4B4] mt-2.5">Tap a star to select your rating</p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setRatingStore(null)}>Cancel</Button>
              <Button variant="primary"   className="flex-1" loading={submitting} onClick={handleSubmitRating}>
                {ratingStore.user_rating ? 'Update Rating' : 'Submit Rating'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function StoreCard({ store, onRate }) {
  const hasRated = store.user_rating != null;
  const avg      = store.average_rating ? Number(store.average_rating).toFixed(1) : null;

  return (
    <div className="card card-hover flex h-full flex-col p-5 gap-4">
      {/* Store name & address */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#1A2530] text-sm leading-tight break-words">{store.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin size={11} className="text-[#B9D6DE] flex-shrink-0" />
            <p className="text-xs text-[#8AA4B4] line-clamp-2">{store.address}</p>
          </div>
        </div>
        {hasRated && (
          <div
            className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1F7A5510] border border-[#1F7A5530] flex items-center justify-center"
            title="You've rated this store"
          >
            <CheckCircle size={13} className="text-[#1F7A55]" />
          </div>
        )}
      </div>

      {/* Rating stats bar */}
      <div className="flex items-center justify-between bg-[#F7FAFB] rounded-xl px-3.5 py-3 border border-[#EEF5F8]">
        <div>
          <p className="text-[10px] font-semibold text-[#8AA4B4] uppercase tracking-wide mb-1">Avg Rating</p>
          {avg ? (
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-[#B85B72] font-[var(--font-display)]">{avg}</span>
              <StarDisplay value={store.average_rating} size={12} />
            </div>
          ) : (
            <span className="text-sm text-[#8AA4B4]">No ratings yet</span>
          )}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold text-[#8AA4B4] uppercase tracking-wide mb-1">Reviews</p>
          <span className="text-lg font-bold text-[#1A2530] font-[var(--font-display)]">{store.total_ratings}</span>
        </div>
      </div>

      {/* User's own rating */}
      {hasRated && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] font-semibold text-[#8AA4B4] uppercase tracking-wide">Your rating:</span>
          <StarDisplay value={store.user_rating} size={12} />
        </div>
      )}

      {/* CTA button */}
      <Button
        variant={hasRated ? 'secondary' : 'primary'}
        size="sm"
        className="w-full mt-auto"
        onClick={() => onRate(store)}
      >
        <Star size={13} className={hasRated ? '' : 'fill-current'} />
        {hasRated ? 'Update Rating' : 'Rate Store'}
      </Button>
    </div>
  );
}
