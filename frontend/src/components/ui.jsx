import { createPortal } from 'react-dom';

export function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B85B72] focus-visible:ring-offset-2';

  const variants = {
    primary:   'bg-[#8A2B3E] hover:bg-[#6D1F30] text-white shadow-sm active:scale-[0.98]',
    secondary: 'bg-white hover:bg-[#F1FBFF] text-[#1A2530] border border-[#D6E8EE] hover:border-[#B9D6DE] active:scale-[0.98]',
    ghost:     'hover:bg-[#F1FBFF] text-[#52697A] hover:text-[#1A2530] active:scale-[0.98]',
    danger:    'bg-[#C0392B14] hover:bg-[#C0392B22] text-[#C0392B] border border-[#C0392B25] hover:border-[#C0392B44] active:scale-[0.98]',
    success:   'bg-[#1F7A5514] hover:bg-[#1F7A5522] text-[#1F7A55] border border-[#1F7A5525] hover:border-[#1F7A5544] active:scale-[0.98]',
    muted:     'bg-[#EEF5F8] hover:bg-[#D6ECF2] text-[#52697A] active:scale-[0.98]',
  };

  const sizes = {
    xs: 'min-h-7 px-2.5 py-1 text-xs',
    sm: 'min-h-8 px-3 py-1.5 text-xs',
    md: 'min-h-10 px-4 py-2.5 text-sm',
    lg: 'min-h-11 px-5 py-3 text-sm',
    xl: 'min-h-12 px-7 py-3.5 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />}
      {children}
    </button>
  );
}

export function Input({ label, error, icon: Icon, hint, className = '', ...props }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-[#52697A] tracking-wide uppercase">
          {label}
        </label>
      )}
      <div className="relative min-w-0">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B9D6DE] pointer-events-none">
            <Icon size={15} />
          </span>
        )}
        <input
          className={`input-field min-h-11 ${Icon ? 'input-field--with-icon' : ''} ${error ? 'border-[#C0392B88] focus:border-[#C0392B] focus:shadow-[0_0_0_3px_#C0392B12]' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-[#C0392B] flex items-center gap-1">⚠ {error}</span>}
      {hint && !error && <span className="text-xs text-[#8AA4B4]">{hint}</span>}
    </div>
  );
}

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:     'bg-[#EEF5F8] text-[#52697A] border-[#D6E8EE]',
    accent:      'bg-[#8A2B3E12] text-[#8A2B3E] border-[#8A2B3E25]',
    success:     'bg-[#1F7A5512] text-[#1F7A55] border-[#1F7A5530]',
    warning:     'bg-[#9C6B1A12] text-[#9C6B1A] border-[#9C6B1A30]',
    danger:      'bg-[#C0392B12] text-[#C0392B] border-[#C0392B30]',
    info:        'bg-[#1A6B8A12] text-[#1A6B8A] border-[#1A6B8A30]',
    admin:       'bg-[#8A2B3E12] text-[#8A2B3E] border-[#8A2B3E25]',
    user:        'bg-[#1F7A5512] text-[#1F7A55] border-[#1F7A5530]',
    store_owner: 'bg-[#9C6B1A12] text-[#9C6B1A] border-[#9C6B1A30]',
  };
  return (
    <span className={`inline-flex max-w-full items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = '', hover = false }) {
  return (
    <div className={`card ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, color = 'crimson', trend }) {
  const colors = {
    crimson: { bg: 'bg-[#8A2B3E0D]', text: 'text-[#8A2B3E]', border: 'border-[#8A2B3E20]' },
    rose:    { bg: 'bg-[#B85B7212]', text: 'text-[#B85B72]',  border: 'border-[#B85B7225]' },
    mist:    { bg: 'bg-[#B9D6DE18]', text: 'text-[#1A6B8A]',  border: 'border-[#B9D6DE40]' },
    success: { bg: 'bg-[#1F7A5510]', text: 'text-[#1F7A55]',  border: 'border-[#1F7A5525]' },
    warning: { bg: 'bg-[#9C6B1A10]', text: 'text-[#9C6B1A]',  border: 'border-[#9C6B1A25]' },

    accent:  { bg: 'bg-[#8A2B3E0D]', text: 'text-[#8A2B3E]', border: 'border-[#8A2B3E20]' },
    emerald: { bg: 'bg-[#1F7A5510]', text: 'text-[#1F7A55]',  border: 'border-[#1F7A5525]' },
    amber:   { bg: 'bg-[#9C6B1A10]', text: 'text-[#9C6B1A]',  border: 'border-[#9C6B1A25]' },
    sky:     { bg: 'bg-[#1A6B8A10]', text: 'text-[#1A6B8A]',  border: 'border-[#1A6B8A25]' },
  };
  const c = colors[color] || colors.crimson;
  return (
    <Card className={`stat-card stat-card--${color} h-full`}>
      <div className="stat-card__content">
        <div className="min-w-0">
          <p className="stat-card__label">{label}</p>
          <p className="stat-card__value">{value}</p>
          {trend && <p className="mt-1 text-xs font-medium text-[#1F7A55]">{trend}</p>}
        </div>
        {Icon && (
          <div className={`stat-card__icon ${c.bg} ${c.text}`} aria-hidden="true">
            <Icon size={21} strokeWidth={1.8} />
          </div>
        )}
      </div>
    </Card>
  );
}

export function Spinner({ size = 22 }) {
  return (
    <div
      className="border-2 border-[#D6E8EE] border-t-[#8A2B3E] rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 sm:py-16 gap-3 text-center px-6">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#EEF5F8] border border-[#D6E8EE] flex items-center justify-center mb-1">
          <Icon size={22} className="text-[#B9D6DE]" />
        </div>
      )}
      <p className="text-sm font-semibold text-[#52697A]">{title}</p>
      {description && <p className="text-xs text-[#8AA4B4] max-w-xs leading-relaxed">{description}</p>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, width = 'max-w-md' }) {
  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div className="modal-root fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-6" role="presentation" onClick={onClose}>
      <div className="absolute inset-0 bg-[#1A2530]/30 backdrop-blur-sm" />
      <div
        className={`relative ${width} w-full max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] flex flex-col overflow-hidden bg-white border border-[#D6E8EE] rounded-2xl shadow-xl page-enter`}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Dialog'}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-[#EEF5F8]">
            <h3 className="min-w-0 text-base font-bold text-[#1A2530] font-[var(--font-display)]">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="w-7 h-7 rounded-lg bg-[#F1FBFF] hover:bg-[#D6ECF2] flex items-center justify-center text-[#8AA4B4] hover:text-[#1A2530] transition-all"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>
        )}
        <div className="px-5 sm:px-6 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export function Table({ columns, data, loading, emptyIcon, emptyText }) {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 rounded-xl shimmer" />
        ))}
      </div>
    );
  }
  if (!data?.length) {
    return <EmptyState icon={emptyIcon} title={emptyText || 'No data found'} />;
  }
  return (
    <div className="overflow-x-auto overscroll-contain">
      <table className="min-w-max w-full text-sm">
        <thead>
          <tr className="border-b border-[#EEF5F8]">
            {columns.map(col => (
              <th
                key={col.key}
                className="text-left py-3 px-4 sm:px-5 text-xs font-semibold text-[#8AA4B4] uppercase tracking-wider whitespace-nowrap bg-[#F7FAFB]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              className="border-b border-[#F1FBFF] hover:bg-[#F7FAFB] transition-colors"
            >
              {columns.map(col => (
                <td key={col.key} className="py-3.5 px-4 sm:px-5 text-[#1A2530] whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StarDisplay({ value, size = 14 }) {
  const filled = Math.round(Number(value));
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 20 20" fill={s <= filled ? '#B85B72' : '#D6E8EE'}>
          <path d="M10 1l2.39 6.26L19 7.64l-5 4.87 1.18 6.87L10 16.27l-5.18 3.11L6 12.51 1 7.64l6.61-.38z" />
        </svg>
      ))}
      {value != null && (
        <span className="text-xs text-[#8AA4B4] ml-1 font-medium">{Number(value).toFixed(1)}</span>
      )}
    </div>
  );
}

export function StarRating({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className="star rounded-md p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B85B72]"
        >
          <svg width="30" height="30" viewBox="0 0 20 20" fill={s <= value ? '#B85B72' : '#D6E8EE'} className="transition-colors duration-100">
            <path d="M10 1l2.39 6.26L19 7.64l-5 4.87 1.18 6.87L10 16.27l-5.18 3.11L6 12.51 1 7.64l6.61-.38z" />
          </svg>
        </button>
      ))}
      {value > 0 && (
        <span className="text-sm text-[#8AA4B4] ml-1 font-medium">{value}/5</span>
      )}
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative min-w-0 ${className}`}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B9D6DE] pointer-events-none"
        width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      >
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field input-field--with-icon min-h-11"
      />
    </div>
  );
}

export function Select({ label, options, value, onChange, className = '' }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-[#52697A] uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`input-field min-h-11 appearance-auto cursor-pointer ${className}`}
        style={{ appearance: 'auto' }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold font-[var(--font-display)] text-[#1A2530]">{title}</h1>
        {subtitle && <p className="text-sm text-[#8AA4B4] mt-1">{subtitle}</p>}
      </div>
      {action && <div className="w-full sm:w-auto flex-shrink-0">{action}</div>}
    </div>
  );
}
