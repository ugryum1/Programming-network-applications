# Отчёт по ДЗ. Коллекции, функции, классы + three.js

**Тема:** автоматизация конвейерных линий

**Вариант по фамилии (У)** → задача **2.11** (2 уровень)
**Вариант по группе (ИУ5-42Б)** → задача **3.2** (3 уровень)

## Оглавление

- [Часть 1. Задачи по варианту](#часть-1-задачи-по-варианту)
  - [Задача 2.11 — mergeConveyorThroughput](#задача-211--mergeconveyorthroughput)
  - [Задача 3.2 — inverseConveyorStages](#задача-32--inverseconveyorstages)
  - [Интеграция в тему (ProductionReport)](#интеграция-в-тему-productionreport)
  - [Обязательные элементы ДЗ](#обязательные-элементы-дз)
- [Часть 2. 3D-модель на странице Подробнее](#часть-2-3d-модель-на-странице-подробнее)
- [Стиль под conveer.ru](#стиль-под-conveerru)
- [Структура проекта](#структура-проекта)
- [Запуск](#запуск)

## Часть 1. Задачи по варианту

### Задача 2.11 — mergeConveyorThroughput

Объединяет произвольное количество плоских массивов чисел и возвращает строку
со значениями по убыванию через пробел.

Файл: [utils/merge-throughput.js](utils/merge-throughput.js)

```js
export function mergeConveyorThroughput(...throughputSections) {
    const combined = [];
    for (const section of throughputSections) {
        for (const value of section) combined.push(value);
    }
    combined.sort((a, b) => b - a);
    return combined.join(' ');
}
```

Тест из условия: `mergeConveyorThroughput([1,2,3], [-1,-10,20])` → `"20 3 2 1 -1 -10"` ✓

### Задача 3.2 — inverseConveyorStages

Разворачивает массив. Второй аргумент `keep`:
- не задан → полный реверс;
- `keep > 0` → первые `keep` элементов остаются на месте, остальные разворачиваются;
- `keep < 0` → последние `|keep|` элементов остаются на месте, остальные разворачиваются.

Файл: [utils/inverse-stages.js](utils/inverse-stages.js)

Проверенные случаи:

| Вход | Выход |
|---|---|
| `[1,2,3,4,5]` | `[5,4,3,2,1]` |
| `[1,2,3,4,5], 2` | `[1,2,5,4,3]` |
| `[1,2,3,4,5], -2` | `[3,2,1,4,5]` |
| `['a','b','c','d'], 10` (keep > length) | `['a','b','c','d']` |

### Интеграция в тему (ProductionReport)

На главной странице добавлен блок **«Отчёт по производственной линии»**
([components/production-report/index.js](components/production-report/index.js)),
который использует обе утилиты на реальных данных темы:

- `mergeConveyorThroughput(...)` сводит показатели производительности трёх линий
  в общий топ по убыванию (т/ч).
- `inverseConveyorStages(stages, 2)` формирует порядок этапов в режиме
  демонтажа: первые 2 этапа пуска сохраняются, остальные идут в обратном порядке.

### Обязательные элементы ДЗ

Все в `ProductionReportComponent`:

| Требование | Где реализовано |
|---|---|
| Цикл с постусловием, не по счётчику | `do { ... } while (msg !== "СТОП" && i < queue.length)` в `readUntilStop` — контроллер читает очередь сообщений до команды «СТОП» |
| Объект | `getData()` возвращает объект с полями `throughput`, `stages`, `queue` |
| Строка | итоговый текст отчёта, сообщения лога |
| Коллекция | массивы `throughput`, `stages`, `queue` |

Имена переменных и функций даны по теме: `mergeConveyorThroughput`,
`inverseConveyorStages`, `controllerQueue`, `assemblyStages`, `throughputSections`.

## Часть 2. 3D-модель на странице Подробнее

Компонент [components/conveyor-viewer/index.js](components/conveyor-viewer/index.js)
выводит 3D-модель конвейера рядом с картинкой продукта.

- Используется **three.js** через importmap в [index.html](index.html).
- Загрузка `.glb` — через `GLTFLoader`, управление камерой — через `OrbitControls`.
- Для каждой из 4 карточек каталога подгружается своя модель по пути
  `static/models/{id}.glb` (1 — ленточный, 2 — роликовый, 3 — цепной,
  4 — подвесной).
- Модель автоматически центрируется и масштабируется в сцене.

Путь к модели передаётся из страницы продукта:

```js
new ConveyorViewerComponent(this.pageRoot, `static/models/${data.id}.glb`).render()
```

## Стиль под conveer.ru

Палитра перекрашена под референс `https://conveer.ru/`:

- фон — белый (`#ffffff`), текст — чёрный;
- кнопки (`.btn-primary`, табы, back-button) — чёрные, при наведении темно-синие (`#14213d`);
- шапка — чёрная;
- карточки — светлая рамка, лёгкая тень при hover.

Все стили — в `<style>` блоке [index.html](index.html).

## Структура проекта

```
├── index.html                          — importmap three.js + стили
├── main.js                             — точка входа
├── utils/
│   ├── merge-throughput.js             — задача 2.11
│   └── inverse-stages.js               — задача 3.2
├── components/
│   ├── product-card/                   — карточка каталога
│   ├── product/                        — детальный вид товара
│   ├── back-button/                    — «Назад к каталогу»
│   ├── button-group/                   — вкладки на странице товара
│   ├── production-report/              — блок отчёта (обе утилиты + do-while)
│   └── conveyor-viewer/                — 3D-просмотрщик .glb
├── pages/
│   ├── main/index.js                   — каталог + встроенный отчёт
│   └── product/index.js                — товар + 3D-модель
└── static/
    ├── img/{1..4}.png                  — изображения карточек
    └── models/{1..4}.glb               — 3D-модели (подставляются пользователем)
```

## Запуск

```bash
npm install
python3 -m http.server 8000
# открыть http://localhost:8000/
```
