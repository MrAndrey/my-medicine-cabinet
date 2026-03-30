export default function ShoppingScreen({ t, shopping, onBack, onBought }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10 py-4 px-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-green-600 font-medium h-11 flex items-center gap-1 shrink-0"
        >
          {t['btn.back_list']}
        </button>
        <h2 className="text-lg font-bold text-gray-900">{t['screen.shopping']}</h2>
      </div>

      <div className="flex-1 px-4 pt-5 pb-8">
        {shopping.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-base">
            {t['empty.shopping']}
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {shopping.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 min-h-[60px]"
              >
                <span className="text-base font-medium text-gray-900 flex-1 pr-3">
                  {item.name}
                </span>
                <button
                  onClick={() => onBought(item.id)}
                  className="h-11 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg px-4 text-sm font-medium transition-colors whitespace-nowrap shrink-0"
                >
                  {t['btn.bought']}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
