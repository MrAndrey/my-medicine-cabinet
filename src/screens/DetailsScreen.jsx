import { useState } from 'react'
import dayjs from 'dayjs'

function ExpiryInfo({ med, getMedicineStatus, t }) {
  if (!med.expiry_date) return <span className="text-gray-500">—</span>

  const status = getMedicineStatus(med)
  const today = dayjs().startOf('day')
  const expiry = dayjs(med.expiry_date)
  const daysLeft = expiry.diff(today, 'day')

  let label = ''
  let colorClass = ''

  if (status === 'expired') {
    label = `${expiry.format('DD.MM.YYYY')} — ${t['status.expired']}`
    colorClass = 'text-red-600 font-semibold'
  } else if (status === 'expiring') {
    let timeLabel = ''
    if (daysLeft === 0) timeLabel = t['expiry.today']
    else if (daysLeft === 1) timeLabel = t['expiry.tomorrow']
    else timeLabel = t['expiry.days_left'](daysLeft)
    label = `${expiry.format('DD.MM.YYYY')} (${timeLabel})`
    colorClass = 'text-orange-600 font-semibold'
  } else {
    label = expiry.format('DD.MM.YYYY')
    colorClass = 'text-gray-700'
  }

  return <span className={colorClass}>{label}</span>
}

function StatusBadge({ status, t }) {
  const map = {
    expired: { label: t['status.expired'], cls: 'bg-red-100 text-red-700' },
    expiring: { label: t['status.expiring'], cls: 'bg-orange-100 text-orange-700' },
    ok: { label: t['status.ok'], cls: 'bg-green-100 text-green-700' },
  }
  const { label, cls } = map[status] || map.ok
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cls}`}>{label}</span>
  )
}

export default function DetailsScreen({
  t,
  medicine,
  getMedicineStatus,
  onBack,
  onEdit,
  onDelete,
  onUpdateQuantity,
  onAddToShopping,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!medicine) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="text-green-600 font-medium h-11 flex items-center">
          {t['btn.back']}
        </button>
        <p className="text-gray-500 mt-4">Лекарство не найдено</p>
      </div>
    )
  }

  const status = getMedicineStatus(medicine)
  const isZero = !medicine.quantity || medicine.quantity <= 0

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10 py-4 px-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-green-600 font-medium h-11 flex items-center gap-1 shrink-0"
        >
          {t['btn.back']}
        </button>
        <h2 className="text-lg font-bold text-gray-900 truncate">{medicine.name}</h2>
      </div>

      <div className="flex-1 px-4 pt-5 pb-8">
        {/* Status badge */}
        <div className="flex items-center gap-2 mb-5">
          <StatusBadge status={status} t={t} />
        </div>

        {/* Info card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 mb-5">
          <InfoRow label={t['field.location']} value={medicine.location ? `📍 ${medicine.location}` : '—'} />
          <InfoRow
            label={t['field.quantity']}
            value={
              <span className={isZero ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                {medicine.quantity} {medicine.unit}
              </span>
            }
          />
          <InfoRow
            label={t['field.expiry']}
            value={<ExpiryInfo med={medicine} getMedicineStatus={getMedicineStatus} t={t} />}
          />
          {medicine.category && (
            <InfoRow label={t['field.category']} value={medicine.category} />
          )}
          {medicine.notes && (
            <InfoRow label={t['field.notes']} value={medicine.notes} />
          )}
        </div>

        {/* Quantity controls */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
          <p className="text-sm text-gray-500 mb-3">{t['field.quantity']}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdateQuantity(-1)}
              disabled={isZero}
              className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-40 text-gray-700 font-bold text-xl rounded-xl transition-colors"
            >
              {t['btn.minus']}
            </button>
            <span className="text-2xl font-bold text-gray-900 w-16 text-center">
              {medicine.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(1)}
              className="flex-1 h-12 bg-green-50 hover:bg-green-100 active:bg-green-200 text-green-700 font-bold text-xl rounded-xl transition-colors"
            >
              {t['btn.plus']}
            </button>
          </div>
        </div>

        {/* Zero quantity warning */}
        {isZero && !showDeleteConfirm && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-4">
            <p className="text-amber-800 text-sm font-medium mb-3">{t['warning.zero_quantity']}</p>
            <div className="flex gap-2">
              <button
                onClick={onAddToShopping}
                className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                🛒 {t['btn.add_to_shopping']}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {t['btn.delete']}
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {!showDeleteConfirm && (
          <div className="flex gap-3 mb-4">
            <button
              onClick={onEdit}
              className="flex-1 h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
            >
              {t['btn.edit']}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm"
            >
              {t['btn.delete']}
            </button>
          </div>
        )}

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="bg-white border border-red-200 rounded-xl shadow-sm p-4">
            <p className="font-semibold text-gray-900 mb-1">{t['delete.dialog_title']}</p>
            <p className="text-sm text-gray-600 mb-4">{t['delete.shopping_question']}</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onDelete(true)}
                className="h-11 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                🛒 {t['delete.yes']}
              </button>
              <button
                onClick={() => onDelete(false)}
                className="h-11 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm"
              >
                {t['delete.no']}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
              >
                {t['btn.cancel']}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="text-sm text-gray-500 w-32 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-900 flex-1">{value}</span>
    </div>
  )
}
