import { useState } from 'react'
import dayjs from 'dayjs'

const UNITS = ['таблетки', 'мл', 'упаковки']
const CATEGORIES = ['Обезболивающее', 'Антибиотик', 'Витамины', 'Перевязка', 'Другое']

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

const CURRENT_YEAR = dayjs().year()
const YEARS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR + i)

// Parse YYYY-MM-DD → { month, year } (1-based month)
function parseExpiry(dateStr) {
  if (!dateStr) return { month: '', year: '' }
  const d = dayjs(dateStr)
  if (!d.isValid()) return { month: '', year: '' }
  return { month: d.month() + 1, year: d.year() }
}

// Build YYYY-MM-DD from month+year (last day of month)
function buildExpiry(month, year) {
  if (!month || !year) return ''
  return dayjs(`${year}-${String(month).padStart(2, '0')}-01`)
    .endOf('month')
    .format('YYYY-MM-DD')
}

function getInitialForm(medicine) {
  if (!medicine) {
    return {
      name: '',
      quantity: '',
      unit: 'таблетки',
      location: '',
      expiry_month: '',
      expiry_year: '',
      category: 'Другое',
      notes: '',
    }
  }
  const { month, year } = parseExpiry(medicine.expiry_date)
  return {
    name: medicine.name || '',
    quantity: medicine.quantity !== undefined ? String(medicine.quantity) : '',
    unit: medicine.unit || 'таблетки',
    location: medicine.location || '',
    expiry_month: month,
    expiry_year: year,
    category: medicine.category || 'Другое',
    notes: medicine.notes || '',
  }
}

export default function FormScreen({
  t,
  medicine,
  locations,
  onSave,
  onCancel,
  onAddLocation,
}) {
  const isEdit = !!medicine
  const [form, setForm] = useState(() => getInitialForm(medicine))
  const [errors, setErrors] = useState({})
  const [showNewLocation, setShowNewLocation] = useState(false)
  const [newLocation, setNewLocation] = useState('')
  const [customCategory, setCustomCategory] = useState(
    medicine && !CATEGORIES.includes(medicine.category) ? medicine.category : ''
  )
  const [useCustomCategory, setUseCustomCategory] = useState(
    medicine ? !CATEGORIES.includes(medicine.category) : false
  )

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  function handleLocationChange(value) {
    if (value === '__new__') {
      setShowNewLocation(true)
      setField('location', '')
    } else {
      setShowNewLocation(false)
      setField('location', value)
    }
  }

  function handleNewLocationConfirm() {
    const loc = newLocation.trim()
    if (loc) {
      onAddLocation(loc)
      setField('location', loc)
      setShowNewLocation(false)
      setNewLocation('')
    }
  }

  function handleCategoryChange(value) {
    if (value === '__custom__') {
      setUseCustomCategory(true)
      setField('category', customCategory)
    } else {
      setUseCustomCategory(false)
      setCustomCategory('')
      setField('category', value)
    }
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = t['validation.name_required']
    if (form.quantity === '' || isNaN(Number(form.quantity))) errs.quantity = t['validation.quantity_required']
    if (!form.expiry_month || !form.expiry_year) errs.expiry = t['validation.expiry_required']
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const data = {
      name: form.name.trim(),
      quantity: Number(form.quantity),
      unit: form.unit,
      location: form.location.trim(),
      expiry_date: buildExpiry(form.expiry_month, form.expiry_year),
      category: useCustomCategory ? customCategory.trim() : form.category,
      notes: form.notes.trim(),
    }
    onSave(data)
  }

  const inputClass = (field) =>
    `h-11 border rounded-lg px-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`

  const selectClass = (field) =>
    `h-11 border rounded-lg px-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white appearance-none ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10 py-4 px-4 flex items-center gap-3">
        <button
          onClick={onCancel}
          className="text-green-600 font-medium h-11 flex items-center shrink-0"
        >
          {t['btn.back']}
        </button>
        <h2 className="text-lg font-bold text-gray-900">
          {isEdit ? t['screen.form_edit'] : t['screen.form_add']}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-4 pt-5 pb-8">
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">{t['field.name']} *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="Например: Парацетамол"
              className={inputClass('name')}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Quantity + Unit */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              {t['field.quantity']} / {t['field.unit']} *
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={(e) => setField('quantity', e.target.value)}
                  placeholder="0"
                  className={inputClass('quantity')}
                />
              </div>
              <select
                value={form.unit}
                onChange={(e) => setField('unit', e.target.value)}
                className="h-11 border border-gray-300 rounded-lg px-3 w-36 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">{t['field.location']}</label>
            <select
              value={showNewLocation ? '__new__' : form.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className={selectClass('location')}
            >
              <option value="">— Выберите место —</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
              <option value="__new__">{t['location.add_new']}</option>
            </select>
            {showNewLocation && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder={t['location.new_placeholder']}
                  className="h-11 border border-gray-300 rounded-lg px-3 flex-1 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleNewLocationConfirm()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleNewLocationConfirm}
                  className="h-11 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 text-sm font-medium transition-colors"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewLocation(false)
                    setNewLocation('')
                  }}
                  className="h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-3 text-sm transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Expiry date */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">{t['field.expiry']} *</label>
            <div className="flex gap-2">
              <select
                value={form.expiry_month}
                onChange={(e) => setField('expiry_month', e.target.value ? Number(e.target.value) : '')}
                className={`h-11 border rounded-lg px-3 flex-1 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white appearance-none ${errors.expiry ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              >
                <option value="">Месяц</option>
                {MONTHS.map((name, i) => (
                  <option key={i + 1} value={i + 1}>{name}</option>
                ))}
              </select>
              <select
                value={form.expiry_year}
                onChange={(e) => setField('expiry_year', e.target.value ? Number(e.target.value) : '')}
                className={`h-11 border rounded-lg px-3 w-28 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white appearance-none ${errors.expiry ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              >
                <option value="">Год</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            {errors.expiry && (
              <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">{t['field.category']}</label>
            <select
              value={useCustomCategory ? '__custom__' : form.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={selectClass('category')}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__custom__">{t['category.custom']}</option>
            </select>
            {useCustomCategory && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value)
                  setField('category', e.target.value)
                }}
                placeholder="Введите категорию"
                className="h-11 border border-gray-300 rounded-lg px-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white mt-2"
              />
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">{t['field.notes']}</label>
            <textarea
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
              placeholder="Дозировка, инструкции, особые условия..."
              rows={3}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white resize-none min-h-[88px]"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-xl transition-colors text-base"
            >
              {t['btn.save']}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors text-sm"
            >
              {t['btn.cancel']}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
