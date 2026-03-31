export default function BottomNav({ t, screen, onNavigate, shoppingCount }) {
  const tabs = [
    { id: 'list', label: t['nav.list'], icon: '💊' },
    { id: 'locations', label: t['nav.locations'], icon: '🗂️' },
    { id: 'shopping', label: t['nav.shopping'], icon: '🛒', badge: shoppingCount },
  ]

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-200 z-10">
      <div className="flex">
        {tabs.map((tab) => {
          const active = screen === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                active ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className={`text-xs font-medium ${active ? 'text-green-600' : 'text-gray-400'}`}>
                {tab.label}
              </span>
              {tab.badge > 0 && (
                <span className="absolute top-1 right-1/4 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                  {tab.badge}
                </span>
              )}
              {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-green-600 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
