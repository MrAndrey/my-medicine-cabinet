import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { t } from './translations'
import ListScreen from './screens/ListScreen'
import DetailsScreen from './screens/DetailsScreen'
import FormScreen from './screens/FormScreen'
import ShoppingScreen from './screens/ShoppingScreen'

const DEFAULT_LOCATIONS = ['Шкаф в ванной', 'Комод', 'Аптечка на кухне']
const DEFAULT_SETTINGS = { expiry_warning_days: 7 }

function loadLS(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function saveLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export default function App() {
  const [screen, setScreen] = useState('list') // 'list'|'details'|'form'|'shopping'
  const [medicines, setMedicines] = useState(() => loadLS('medicines', []))
  const [shopping, setShopping] = useState(() => loadLS('shopping', []))
  const [locations, setLocations] = useState(() => loadLS('locations', DEFAULT_LOCATIONS))
  const [customCategories, setCustomCategories] = useState(() => loadLS('customCategories', []))
  const [customUnits, setCustomUnits] = useState(() => loadLS('customUnits', []))
  const [settings, setSettings] = useState(() => loadLS('settings', DEFAULT_SETTINGS))
  const [selectedId, setSelectedId] = useState(null)
  const [editId, setEditId] = useState(null) // null = add, id = edit
  const [filterProblematic, setFilterProblematic] = useState(false)
  const [search, setSearch] = useState('')

  // Persist to localStorage
  useEffect(() => saveLS('medicines', medicines), [medicines])
  useEffect(() => saveLS('shopping', shopping), [shopping])
  useEffect(() => saveLS('locations', locations), [locations])
  useEffect(() => saveLS('customCategories', customCategories), [customCategories])
  useEffect(() => saveLS('customUnits', customUnits), [customUnits])
  useEffect(() => saveLS('settings', settings), [settings])

  // Medicine status helpers
  function getMedicineStatus(med) {
    if (!med.expiry_date) return 'ok'
    const today = dayjs().startOf('day')
    const expiry = dayjs(med.expiry_date)
    const daysLeft = expiry.diff(today, 'day')
    if (daysLeft < 0) return 'expired'
    if (daysLeft <= settings.expiry_warning_days) return 'expiring'
    return 'ok'
  }

  function getProblematicCount() {
    return medicines.filter((m) => getMedicineStatus(m) !== 'ok').length
  }

  // Navigation helpers
  function openDetails(id) {
    setSelectedId(id)
    setScreen('details')
  }

  function openAdd() {
    setEditId(null)
    setScreen('form')
  }

  function openEdit(id) {
    setEditId(id)
    setScreen('form')
  }

  function goList() {
    setScreen('list')
    setSelectedId(null)
    setEditId(null)
  }

  // CRUD
  function saveMedicine(data) {
    if (editId) {
      setMedicines((prev) => prev.map((m) => (m.id === editId ? { ...data, id: editId } : m)))
    } else {
      setMedicines((prev) => [...prev, { ...data, id: Date.now() }])
    }
    goList()
  }

  function deleteMedicine(id, addToShopping) {
    const med = medicines.find((m) => m.id === id)
    if (addToShopping && med) {
      setShopping((prev) => [...prev, { name: med.name, id: Date.now() }])
    }
    setMedicines((prev) => prev.filter((m) => m.id !== id))
    goList()
  }

  function updateQuantity(id, delta) {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m
        const newQty = Math.max(0, (m.quantity || 0) + delta)
        return { ...m, quantity: newQty }
      })
    )
  }

  function addLocation(loc) {
    if (loc && !locations.includes(loc)) {
      setLocations((prev) => [...prev, loc])
    }
  }

  function addCustomCategory(cat) {
    if (cat && !customCategories.includes(cat)) {
      setCustomCategories((prev) => [...prev, cat])
    }
  }

  function addCustomUnit(unit) {
    if (unit && !customUnits.includes(unit)) {
      setCustomUnits((prev) => [...prev, unit])
    }
  }

  function removeShopping(id) {
    setShopping((prev) => prev.filter((s) => s.id !== id))
  }

  // Build props for each screen
  const commonProps = { t, getMedicineStatus, settings, setSettings }

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      {screen === 'list' && (
        <ListScreen
          {...commonProps}
          medicines={medicines}
          search={search}
          setSearch={setSearch}
          filterProblematic={filterProblematic}
          setFilterProblematic={setFilterProblematic}
          problematicCount={getProblematicCount()}
          onOpenDetails={openDetails}
          onAdd={openAdd}
          onOpenShopping={() => setScreen('shopping')}
          shoppingCount={shopping.length}
        />
      )}
      {screen === 'details' && (
        <DetailsScreen
          {...commonProps}
          medicine={medicines.find((m) => m.id === selectedId)}
          onBack={goList}
          onEdit={() => openEdit(selectedId)}
          onDelete={(addToShopping) => deleteMedicine(selectedId, addToShopping)}
          onUpdateQuantity={(delta) => updateQuantity(selectedId, delta)}
          onAddToShopping={() => {
            const med = medicines.find((m) => m.id === selectedId)
            if (med) setShopping((prev) => [...prev, { name: med.name, id: Date.now() }])
          }}
        />
      )}
      {screen === 'form' && (
        <FormScreen
          {...commonProps}
          medicine={editId ? medicines.find((m) => m.id === editId) : null}
          locations={locations}
          customCategories={customCategories}
          customUnits={customUnits}
          onSave={saveMedicine}
          onCancel={goList}
          onAddLocation={addLocation}
          onAddCategory={addCustomCategory}
          onAddUnit={addCustomUnit}
        />
      )}
      {screen === 'shopping' && (
        <ShoppingScreen
          {...commonProps}
          shopping={shopping}
          onBack={goList}
          onBought={removeShopping}
        />
      )}
    </div>
  )
}
