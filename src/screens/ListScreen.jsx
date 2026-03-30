import dayjs from 'dayjs'

function ExpiryBadge({ med, getMedicineStatus, t }) {
  if (!med.expiry_date) return null
  const status = getMedicineStatus(med)
  const today = dayjs().startOf('day')
  const expiry = dayjs(med.expiry_date)
  const daysLeft = expiry.diff(today, 'day')

  let label = ''
  let colorClass = ''

  if (status === 'expired') {
    label = t['status.expired']
    colorClass = 'bg-red-100 text-red-700'
  } else if (status === 'expiring') {
    if (daysLeft === 0) label = t['expiry.today']
    else if (daysLeft === 1) label = t['expiry.tomorrow']
    else label = t['expiry.days_left'](daysLeft)
    colorClass = 'bg-orange-100 text-orange-700'
  } else {
    label = expiry.format('DD.MM.YYYY')
    colorClass = 'bg-gray-100 text-gray-500'
  }

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
      {label}
    </span>
  )
}

function MedicineCard({ med, getMedicineStatus, t, onClick }) {
  const status = getMedicineStatus(med)

  const cardColor =
    status === 'expired'
      ? 'bg-red-50 border-red-300'
      : status === 'expiring'
      ? 'bg-yellow-50 border-yellow-300'
      : 'bg-white border-gray-200'

  return (
    <button
      onClick={() => onClick(med.id)}
      className={`w-full text-left rounded-xl border p-4 shadow-sm mb-3 min-h-[72px] flex flex-col gap-1 active:opacity-70 transition-opacity ${cardColor}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-lg font-semibold text-gray-900 leading-tight">{med.name}</span>
        <ExpiryBadge med={med} getMedicineStatus={getMedicineStatus} t={t} />
      </div>
      <div className="flex items-center gap-3 mt-1">
        {med.location && (
          <span className="text-sm text-gray-500">
            📍 {med.location}
          </span>
        )}
        <span className="text-sm text-gray-600 font-medium">
          {med.quantity} {med.unit}{med.pack_count ? ` по ${med.pack_count} шт.` : ''}
        </span>
      </div>
      {med.category && (
        <span className="text-xs text-gray-400">{med.category}</span>
      )}
    </button>
  )
}

export default function ListScreen({
  t,
  medicines,
  getMedicineStatus,
  settings,
  setSettings,
  search,
  setSearch,
  filterProblematic,
  setFilterProblematic,
  problematicCount,
  onOpenDetails,
  onAdd,
  onOpenShopping,
  shoppingCount,
}) {
  const filtered = medicines.filter((med) => {
    const query = search.toLowerCase()
    const matchesSearch =
      !query ||
      med.name.toLowerCase().includes(query) ||
      (med.category && med.category.toLowerCase().includes(query))
    const matchesFilter = !filterProblematic || getMedicineStatus(med) !== 'ok'
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10 py-4 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">{t['app.title']}</h1>
          <button
            onClick={onOpenShopping}
            className="relative flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-3 h-11 text-sm font-medium transition-colors"
          >
            🛒 {t['btn.shopping_list']}
            {shoppingCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {shoppingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 pt-4 pb-24">
        {/* Problematic badge */}
        {problematicCount > 0 && (
          <div className="mb-3">
            <button
              onClick={() => setFilterProblematic(!filterProblematic)}
              className={`w-full text-left rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                filterProblematic
                  ? 'bg-orange-100 border-orange-400 text-orange-800'
                  : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
              }`}
            >
              {t['badge.attention'](problematicCount)}
              {filterProblematic && (
                <span className="ml-2 underline text-orange-700">{t['btn.show_all']}</span>
              )}
            </button>
          </div>
        )}

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t['search.placeholder']}
          className="h-11 border border-gray-300 rounded-lg px-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 mb-3 bg-white text-sm"
        />

        {/* Settings row */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2">
          <span>{t['settings.warning_days']}</span>
          <input
            type="number"
            min="1"
            max="90"
            value={settings.expiry_warning_days}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              if (!isNaN(val) && val >= 1) {
                setSettings((prev) => ({ ...prev, expiry_warning_days: val }))
              }
            }}
            className="w-16 h-8 border border-gray-300 rounded-lg px-2 text-center focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        {/* Medicine list */}
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-16 text-base">
            {medicines.length === 0 ? t['empty.list'] : 'Ничего не найдено'}
          </div>
        )}

        {filtered.map((med) => (
          <MedicineCard
            key={med.id}
            med={med}
            getMedicineStatus={getMedicineStatus}
            t={t}
            onClick={onOpenDetails}
          />
        ))}
      </div>

      {/* Fixed bottom add button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 pb-4 pt-2 bg-gradient-to-t from-gray-50 to-transparent">
        <button
          onClick={onAdd}
          className="w-full h-12 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-xl shadow-md transition-colors text-base"
        >
          + {t['btn.add']}
        </button>
      </div>
    </div>
  )
}
