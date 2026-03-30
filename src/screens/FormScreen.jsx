import { useState } from 'react'
import dayjs from 'dayjs'

const PRESET_UNITS = ['таблетки', 'мл', 'упаковки', 'флакон']
const CATEGORIES = ['Обезболивающее', 'Антибиотик', 'Витамины', 'Перевязка', 'Другое']

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

const CURRENT_YEAR = dayjs().year()
const YEARS = Array.from({ length: CURRENT_YEAR - 2020 + 11 }, (_, i) => 2020 + i)

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
      unit_custom: '',
      pack_count: '',
      location: '',
      expiry_month: '',
      expiry_year: '',
      category: 'Другое',
      notes: '',
    }
  }
  const { month, year } = parseExpiry(medicine.expiry_date)
  const isPreset = PRESET_UNITS.includes(medicine.unit)
  return {
    name: medicine.name || '',
    quantity: medicine.quantity !== undefined ? String(medicine.quantity) : '',
    unit: isPreset ? medicine.unit : '__custom__',
    unit_custom: isPreset ? '' : (medicine.unit || ''),
    pack_count: medicine.pack_count ? String(medicine.pack_count) : '',
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
  customCategories,
  onSave,
  onCancel,
  onAddLocation,
  onAddCategory,
}) {
  const isEdit = !!medicine
  const [form, setForm] = useState(() => getInitialForm(medicine))
  const [errors, setErrors] = useState({})
  const [showNewLocation, setShowNewLocation] = useState(false)
  const [newLocation, setNewLocation] = useState('')

  const isCustomUnit = form.unit === '__custom__'
  const isPackages = form.unit === 'упаковки'

  const allCategories = [...CATEGORIES, ...customCategories.filter(c => !CATEGORIES.includes(c))]
  const [useCustomCategory, setUseCustomCategory] = useState(
    medicine ? !allCategories.includes(medicine.category) : false
  )
  const [customCategory, setCustomCategory] = useState(
    medicine && !allCategories.includes(medicine.category) ? medicine.category : ''
  )

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  function handleUnitChange(value) {
    setField('unit', value)
    if (value !== 'упаковки') setField('pack_count', '')
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
    if (isCustomUnit && !form.unit_custom.trim()) errs.unit_custom = 'Введите единицу'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const finalCategory = useCustomCategory ? customCategory.trim() : form.category
    if (useCustomCategory && customCategory.trim()) {
      onAddCategory(customCategory.trim())
    }

    const data = {
      name: form.name.trim(),
      quantity: Number(form.quantity),
      unit: isCustomUnit ? form.unit_custom.trim() : form.unit,
      pack_count: isPackages && form.pack_count ? Number(form.pack_count) : undefined,
      location: form.location.trim(),
      expiry_date: buildExpiry(form.expiry_month, form.expiry_year),
      category: finalCategory,
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
                onChange={(e) => handleUnitChange(e.target.value)}
                className="h-11 border border-gray-300 rounded-lg px-3 w-36 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
              >
                {PRESET_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
                <option value="__custom__">Своя...</option>
              </select>
            </div>
            {isCustomUnit && (
              <input
                type="text"
                value={form.unit_custom}
                onChange={(e) => setField('unit_custom', e.target.value)}
                placeholder="Например: капсулы, саше, г"
                className={`${inputClass('unit_custom')} mt-2`}
              />
            )}
            {isPackages && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500 shrink-0">по</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.pack_count}
                  onChange={(e) => setField('pack_count', e.target.value)}
                  placeholder="10"
                  className="h-11 border border-gray-300 rounded-lg px-3 w-24 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
                />
                <span className="text-sm text-gray-500">шт. в упаковке</span>
              </div>
            )}
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            {errors.unit_custom && <p className="text-red-500 text-xs mt-1">{errors.unit_custom}</p>}
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
                <option key={loc} value={loc}>{loc}</option>
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
                    if (e.key === 'Enter') { e.preventDefault(); handleNewLocationConfirm() }
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
                  onClick={() => { setShowNewLocation(false); setNewLocation('') }}
                  className="h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-3 text-sm transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Expiry date — optional */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">{t['field.expiry']}</label>
            <div className="flex gap-2">
              <select
                value={form.expiry_month}
                onChange={(e) => setField('expiry_month', e.target.value ? Number(e.target.value) : '')}
                className="h-11 border border-gray-300 rounded-lg px-3 flex-1 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white appearance-none"
              >
                <option value="">Месяц</option>
                {MONTHS.map((name, i) => (
                  <option key={i + 1} value={i + 1}>{name}</option>
                ))}
              </select>
              <select
                value={form.expiry_year}
                onChange={(e) => setField('expiry_year', e.target.value ? Number(e.target.value) : '')}
                className="h-11 border border-gray-300 rounded-lg px-3 w-28 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white appearance-none"
              >
                <option value="">Год</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">{t['field.category']}</label>
            <select
              value={useCustomCategory ? '__custom__' : form.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={selectClass('category')}
            >
              {allCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
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
