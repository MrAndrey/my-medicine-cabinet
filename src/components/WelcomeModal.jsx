import { useState } from 'react'

function MedIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="72" height="72" rx="20" fill="#dcfce7" />
      {/* Cross */}
      <rect x="30" y="14" width="12" height="44" rx="6" fill="#16a34a" />
      <rect x="14" y="30" width="44" height="12" rx="6" fill="#16a34a" />
      {/* Pill overlay */}
      <ellipse cx="50" cy="22" rx="9" ry="5" transform="rotate(-45 50 22)" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5" />
      <line x1="44.5" y1="16.5" x2="55.5" y2="27.5" stroke="#16a34a" strokeWidth="1.5" />
    </svg>
  )
}

function Page1({ t, onStart, onMore, onNeverShow }) {
  return (
    <>
      <div className="flex justify-center mb-5">
        <MedIcon />
      </div>
      <h2 className="text-xl font-bold text-gray-900 text-center mb-3 leading-tight">
        {t['welcome.title']}
      </h2>
      <p className="text-sm text-gray-600 text-center leading-relaxed mb-7">
        {t['welcome.text']}
      </p>
      <div className="flex flex-col gap-3">
        <button
          onClick={onStart}
          className="w-full h-12 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-xl transition-colors text-base"
        >
          {t['welcome.btn_start']}
        </button>
        <button
          onClick={onMore}
          className="w-full h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors text-sm"
        >
          {t['welcome.btn_more']}
        </button>
        <button
          onClick={onNeverShow}
          className="w-full h-9 text-gray-400 hover:text-gray-600 text-xs transition-colors"
        >
          {t['welcome.btn_never']}
        </button>
      </div>
    </>
  )
}

function ColorDot({ color }) {
  const cls = {
    white: 'bg-white border-gray-300',
    yellow: 'bg-yellow-100 border-yellow-300',
    red: 'bg-red-100 border-red-300',
  }[color]
  return <span className={`inline-block w-4 h-4 rounded border shrink-0 mt-0.5 ${cls}`} />
}

function GuideItem({ icon, title, children }) {
  return (
    <div className="flex gap-3">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <div className="text-sm text-gray-600 mt-0.5">{children}</div>
      </div>
    </div>
  )
}

function Page2({ t, onBack, onClose, onNeverShow }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={onBack}
          className="text-green-600 font-medium text-sm h-8 flex items-center"
        >
          {t['welcome.btn_back']}
        </button>
        <h2 className="text-lg font-bold text-gray-900">{t['welcome.guide_title']}</h2>
      </div>

      <div className="flex flex-col gap-5 mb-7">
        <GuideItem icon="💊" title={t['welcome.guide_add_title']}>
          {t['welcome.guide_add_text']}
        </GuideItem>

        <GuideItem icon="🔍" title={t['welcome.guide_find_title']}>
          {t['welcome.guide_find_text']}
        </GuideItem>

        <GuideItem icon="🎨" title={t['welcome.guide_colors_title']}>
          <div className="flex flex-col gap-1 mt-1">
            <span className="flex items-center gap-2">
              <ColorDot color="white" /> {t['welcome.guide_colors_text_white']}
            </span>
            <span className="flex items-center gap-2">
              <ColorDot color="yellow" /> {t['welcome.guide_colors_text_yellow']}
            </span>
            <span className="flex items-center gap-2">
              <ColorDot color="red" /> {t['welcome.guide_colors_text_red']}
            </span>
          </div>
        </GuideItem>

        <GuideItem icon="🛒" title={t['welcome.guide_shopping_title']}>
          {t['welcome.guide_shopping_text']}
        </GuideItem>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onClose}
          className="w-full h-12 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-xl transition-colors text-base"
        >
          {t['welcome.btn_close']}
        </button>
        <button
          onClick={onNeverShow}
          className="w-full h-9 text-gray-400 hover:text-gray-600 text-xs transition-colors"
        >
          {t['welcome.btn_never']}
        </button>
      </div>
    </>
  )
}

export default function WelcomeModal({ t, onClose, onNeverShow }) {
  const [page, setPage] = useState(1)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 max-h-[90vh] overflow-y-auto">
        {page === 1 ? (
          <Page1 t={t} onStart={onClose} onMore={() => setPage(2)} onNeverShow={onNeverShow} />
        ) : (
          <Page2 t={t} onBack={() => setPage(1)} onClose={onClose} onNeverShow={onNeverShow} />
        )}
      </div>
    </div>
  )
}
