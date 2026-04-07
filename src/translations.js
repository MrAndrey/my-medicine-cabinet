export const t = {
  // App
  'app.title': 'Моя аптечка',

  // Badge
  'badge.attention': (count) => `⚠️ ${count} лекарств требуют внимания`,

  // Screen titles
  'screen.list': 'Моя аптечка',
  'screen.details': 'Лекарство',
  'screen.form_add': 'Добавить лекарство',
  'screen.form_edit': 'Редактировать',
  'screen.shopping': 'Список покупок',

  // Search
  'search.placeholder': 'Поиск по названию или категории...',

  // Buttons
  'btn.add': 'Добавить лекарство',
  'btn.edit': 'Редактировать',
  'btn.delete': 'Удалить',
  'btn.save': 'Сохранить',
  'btn.cancel': 'Отмена',
  'btn.minus': '−1',
  'btn.plus': '+1',
  'btn.bought': 'Куплено ✓',
  'btn.shopping_list': 'Список покупок',
  'btn.back': '← Назад',
  'btn.back_list': '← Аптечка',
  'btn.show_all': 'Показать все',
  'btn.add_to_shopping': 'В покупки',

  // Fields
  'field.name': 'Название',
  'field.quantity': 'Количество',
  'field.unit': 'Единица',
  'field.location': 'Место хранения',
  'field.expiry': 'Срок годности',
  'field.category': 'Категория',
  'field.notes': 'Заметки',

  // Units
  'unit.tablets': 'таблетки',
  'unit.ml': 'мл',
  'unit.packages': 'упаковки',

  // Categories
  'category.pain': 'Обезболивающее',
  'category.antibiotic': 'Антибиотик',
  'category.vitamins': 'Витамины',
  'category.bandage': 'Перевязка',
  'category.other': 'Другое',
  'category.custom': 'Своя категория...',

  // Location
  'location.add_new': 'Добавить новое место...',
  'location.new_placeholder': 'Название места',

  // Delete dialog
  'delete.dialog_title': 'Удалить лекарство?',
  'delete.shopping_question': 'Добавить в список покупок?',
  'delete.yes': 'Да, добавить',
  'delete.no': 'Нет, просто удалить',

  // Empty states
  'empty.list': 'Аптечка пуста. Добавьте первое лекарство!',
  'empty.shopping': 'Список покупок пуст',

  // Status
  'status.expired': 'Просрочено',
  'status.expiring': 'Истекает',
  'status.ok': 'В порядке',

  // Warnings
  'warning.zero_quantity': 'Количество = 0. Удалить или добавить в покупки?',

  // Settings
  'settings.warning_days': 'Предупреждать за (дней):',

  // Navigation
  'nav.list': 'Аптечка',
  'nav.locations': 'Где лежит',
  'nav.shopping': 'Покупки',

  // Locations screen
  'locations.title': 'Что где лежит',
  'locations.empty': 'Нет лекарств с указанным местом хранения',

  // Expiry display
  'expiry.days_left': (n) => `${n} дн.`,
  'expiry.today': 'Сегодня',
  'expiry.tomorrow': 'Завтра',

  // Validation
  'validation.name_required': 'Введите название',
  'validation.quantity_required': 'Введите количество',
  'validation.expiry_required': 'Укажите срок годности',

  // Voice input
  'voice.api_error': 'Не удалось обработать. Проверьте подключение.',

  // Welcome modal
  'welcome.title': 'Добро пожаловать в Мою аптечку!',
  'welcome.text': 'Здесь ты можешь вести домашнюю аптечку: упорядочить лекарства по местам хранения, быстро найти где что лежит, контролировать сроки годности и получать напоминания.',
  'welcome.btn_start': 'Начать',
  'welcome.btn_more': 'Узнать больше',
  'welcome.btn_back': '← Назад',
  'welcome.btn_close': 'Всё понятно, начать!',
  'welcome.btn_never': 'Больше не показывать',
  'welcome.guide_title': 'Как пользоваться',
  'welcome.guide_add_title': 'Добавить лекарство',
  'welcome.guide_add_text': 'Нажми «Добавить лекарство» внизу экрана. Укажи название, количество, место хранения и срок годности — за 20 секунд.',
  'welcome.guide_find_title': 'Найти где что лежит',
  'welcome.guide_find_text': 'Используй поиск вверху — по названию или категории. На карточке сразу видно место хранения и сколько осталось.',
  'welcome.guide_colors_title': 'Цвета карточек',
  'welcome.guide_colors_text_white': 'Белая — всё в порядке',
  'welcome.guide_colors_text_yellow': 'Жёлтая — срок истекает скоро',
  'welcome.guide_colors_text_red': 'Красная — срок истёк',
  'welcome.guide_shopping_title': 'Список покупок',
  'welcome.guide_shopping_text': 'При удалении лекарства или когда количество дойдёт до нуля, можно добавить его в список покупок — чтобы не забыть купить.',
}
