import { useState } from 'react'

function worstStatus(meds, getMedicineStatus) {
  const statuses = meds.map(getMedicineStatus)
  if (statuses.includes('expired')) return 'expired'
  if (statuses.includes('expiring')) return 'expiring'
  return 'ok'
}

function LocationCard({ location, meds, getMedicineStatus, onOpenDetails }) {
  const [open, setOpen] = useState(false)
  const status = worstStatus(meds, getMedicineStatus)

  const borderColor =
    status === 'expired' ? 'border-red-300' :
    status === 'expiring' ? 'border-yellow-300' :
    'border-gray-200'

  const headerBg =
    status === 'expired' ? 'bg-red-50' :
    status === 'expiring' ? 'bg-yellow-50' :
    'bg-white'

  const dot =
    status === 'expired' ? 'bg-red-500' :
    status === 'expiring' ? 'bg-yellow-400' :
    null

  return (
    <div className={`rounded-xl border ${borderColor} shadow-sm overflow-hidden mb-3`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 ${headerBg} transition-colors active:opacity-70`}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">📍</span>
          <span className="font-semibold text-gray-900 text-base">{location}</span>
          {dot && <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{meds.length} шт.</span>
          <span className={`text-gray-400 text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
        </div>
      </button>

      {open && (
        <div className="divide-y divide-gray-100">
          {meds.map((med) => {
            const s = getMedicineStatus(med)
            const rowBg =
              s === 'expired' ? 'bg-red-50' :
              s === 'expiring' ? 'bg-yellow-50' :
              'bg-white'
            return (
              <button
                key={med.id}
                onClick={() => onOpenDetails(med.id)}
                className={`w-full flex items-center justify-between px-4 py-3 ${rowBg} active:opacity-70 transition-opacity text-left`}
              >
                <span className="text-sm text-gray-800">{med.name}</span>
                <span className="text-sm text-gray-500 shrink-0 ml-2">
                  {med.quantity} {med.unit}{med.pack_count ? ` по ${med.pack_count} шт.` : ''}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function LocationsScreen({ t, medicines, getMedicineStatus, onOpenDetails }) {
  // Group medicines by location, skip those without location
  const groups = {}
  for (const med of medicines) {
    if (!med.location) continue
    if (!groups[med.location]) groups[med.location] = []
    groups[med.location].push(med)
  }
  const locations = Object.keys(groups).sort()

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white shadow-sm sticky top-0 z-10 py-4 px-4">
        <h1 className="text-xl font-bold text-gray-900">{t['locations.title']}</h1>
      </div>

      <div className="flex-1 px-4 pt-4 pb-24">
        {locations.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-base">{t['locations.empty']}</p>
        ) : (
          locations.map((loc) => (
            <LocationCard
              key={loc}
              location={loc}
              meds={groups[loc]}
              getMedicineStatus={getMedicineStatus}
              onOpenDetails={onOpenDetails}
            />
          ))
        )}
      </div>
    </div>
  )
}
