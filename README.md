# ЛР №6. Знакомство с Promise и fetch, сборка клиентской части.

## Содержание

1. [Цель работы](#1-цель-работы)
2. [Замена коллбеков на промисы и fetch](#2-замена-коллбеков-на-промисы-и-fetch)
   1. [Новый класс `Ajax` на fetch](#21-новый-класс-ajax-на-fetch)
   2. [Базовый URL и same-origin](#22-базовый-url-и-same-origin)
   3. [Переход страниц на async/await](#23-переход-страниц-на-asyncawait)
   4. [Кнопка «Сохранить» (PATCH)](#24-кнопка-сохранить-patch)
3. [Сборка фронтенда через Vite](#3-сборка-фронтенда-через-vite)
   1. [Установка и конфиг](#31-установка-и-конфиг)
   2. [Подключение зависимостей через импорты](#32-подключение-зависимостей-через-импорты)
   3. [Прокси для dev-режима](#33-прокси-для-dev-режима)
4. [Раздача собранной клиентской части бэкендом](#4-раздача-собранной-клиентской-части-бэкендом)
5. [Структура веток](#5-структура-веток)
6. [Порядок запуска и демонстрации](#6-порядок-запуска-и-демонстрации)
7. [Контрольные вопросы](#7-контрольные-вопросы)

## 1. Цель работы

Перевести взаимодействие с API с устаревшего `XMLHttpRequest` на современный
`fetch` с промисами и `async/await`, собрать фронтенд через Vite и
развернуть результат сборки на том же бэкенде, что отдаёт API. Когда
страница и API живут на одном origin, проблема CORS уходит сама собой —
расширение CORS Unblock больше не нужно.

## 2. Замена коллбеков на промисы и fetch

### 2.1. Новый класс `Ajax` на fetch

Старый `Ajax` принимал `callback(data, status)` и крутил
`onreadystatechange`. Теперь все методы — `async`, возвращают
`Promise<{data, status, ok}>`:

```js
class Ajax {
    async get(url) { return this._send('GET', url); }
    async post(url, data) { return this._send('POST', url, data); }
    async patch(url, data) { return this._send('PATCH', url, data); }
    async delete(url) { return this._send('DELETE', url); }

    async _send(method, url, data) {
        const options = {method, headers: {}};
        if (data !== undefined && data !== null) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }
        const response = await fetch(url, options);
        const text = await response.text();
        const payload = text ? JSON.parse(text) : null;
        return {data: payload, status: response.status, ok: response.ok};
    }
}
```

`fetch` сам возвращает промис, поэтому код стал короче и линейнее:
ни обработчиков событий, ни ручной упаковки JSON — всё через `await`.

### 2.2. Базовый URL и same-origin

В `modules/stockUrls.js` `baseUrl` теперь пустая строка, и все методы
строят относительные пути (`/stocks`, `/stocks/:id`). Когда фронтенд
раздаётся бэкендом, такие запросы автоматически идут на тот же origin —
браузер их пропускает без CORS-проверок.

### 2.3. Переход страниц на async/await

Везде, где раньше передавался коллбек, теперь стоит `await ajax.get(...)`
внутри `try/catch`. Пример из `pages/main`:

```js
async getData() {
    const query = this.titleQuery ? {title: this.titleQuery} : {};
    try {
        const {data, status, ok} = await ajax.get(stockUrls.getStocks(query));
        if (ok && Array.isArray(data)) this.renderData(data);
        else this._renderError(`Не удалось загрузить данные (status ${status}).`);
    } catch (err) {
        this._renderError(`Сетевая ошибка: ${err.message}`);
    }
}
```

Логика одна и та же на трёх страницах — `MainPage`, `ProductPage`,
`ProductEditPage`: дождались ответа → отрисовали или вывели ошибку.

### 2.4. Кнопка «Сохранить» (PATCH)

На странице редактирования карточки появилась кнопка «Сохранить». При
сабмите формы собираем `{title, text, src}` и шлём `PATCH /stocks/:id`:

```js
async _onSubmit(event) {
    event.preventDefault();
    const payload = { title: ..., text: ..., src: ... };
    try {
        const {ok, status: code} = await ajax.patch(
            stockUrls.updateStockById(this.id),
            payload,
        );
        // обновляем подпись со статусом
    } catch (err) { /* ... */ }
}
```

После успешного PATCH рядом с кнопкой загорается «Сохранено» —
изменения долетают до `data/stocks.json` бэкенда из ЛР4.

## 3. Сборка фронтенда через Vite

### 3.1. Установка и конфиг

```bash
npm install -D vite
```

`package.json` получил скрипты:

```json
"scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
}
```

`vite.config.js`:

```js
export default {
    base: './',
    build: {
        outDir: './public',
        emptyOutDir: true,
    },
    server: {
        port: 5173,
        proxy: {
            '/stocks': 'http://localhost:3000',
            '/static': 'http://localhost:3000',
        },
    },
};
```

`base: './'` делает пути в собранном `index.html` относительными — это
важно, потому что бэкенд раздаёт `public/` как статику без префикса.
`outDir: './public'` совпадает с папкой, которую читает бэкенд.

### 3.2. Подключение зависимостей через импорты

Раньше bootstrap подключался прямыми ссылками на `node_modules` в
`index.html`:

```html
<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
<script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
```

Это работало только под Live Server и ломалось в продакшене. С Vite
зависимости импортируются прямо в JS, и сборщик сам кладёт их в бандл:

```js
// main.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {MainPage} from "./pages/main/index.js";
```

В `index.html` остаётся один скрипт-точка входа: `<script src="/main.js"
type="module"></script>` — Vite превращает его в хешированный
`/assets/index-XXXX.js`.

### 3.3. Прокси для dev-режима

В dev-режиме фронтенд живёт на `http://localhost:5173`, бэкенд на
`http://localhost:3000` — это разные origin, и снова всплыл бы CORS. Но
в `vite.config.js` настроен прокси: запросы `/stocks` и `/static` Vite
сам пересылает на `localhost:3000`, и в браузере запрос выглядит как
same-origin. Расширение CORS Unblock не нужно даже на этапе разработки.

## 4. Раздача собранной клиентской части бэкендом

Бэкенд из ЛР4 (`example-express`) уже умеет раздавать `/static`. К нему
дописана отдача всего `public/` как корневой статики:

```js
app.use(express.static(path.join(__dirname, '../public')));
```

После `npm run build` папка `public/` копируется в проект бэкенда, и при
заходе на `http://localhost:3000/` сервер отдаёт собранный
`index.html`. Запросы AJAX идут с того же origin — CORS не нужен.

Чтобы демо ЛР5 (на ветке `ajax`) и демо ЛР6 не мешали друг другу,
бандл лежит в **отдельной** ветке `backend-bundle`, созданной от
`backend`. В исходной ветке `backend` ничего не меняется — её можно
по-прежнему использовать как чистый бэкенд для ЛР5. В ветке `fetch`
(ЛР6) хранится только исходный код фронтенда — без `public/` и
`node_modules/`.

## 5. Структура веток

| Ветка | Содержимое |
| --- | --- |
| `simple-web-application` | ЛР3, статичный фронтенд на mock-данных |
| `backend` | ЛР4, чистый Express API (используется в демо ЛР5) |
| `ajax` | ЛР5, фронтенд на XHR с CORS Unblock |
| `fetch` | **текущая ветка**: исходники фронтенда ЛР6 на fetch + Vite |
| `backend-bundle` | копия `backend` + собранный бандл из ЛР6 в `public/` и раздача статики |

## 6. Порядок запуска и демонстрации

1. **Собрать бандл (если ещё не собран).** В директории на ветке
   `fetch`:

   ```bash
   npm install
   npm run build
   ```

   Vite кладёт результат в `./public/` (`index.html` + `assets/`).

2. **Поднять бэкенд со встроенным бандлом из отдельной ветки.**
   Чтобы не трогать существующий worktree ЛР5, заведём для ЛР6
   отдельную ветку `backend-bundle` и отдельный worktree:

   ```bash
   # из корня репозитория (ветка fetch)
   git worktree add -b backend-bundle ../pna-backend-lr6 backend
   cp -r public ../pna-backend-lr6/example-express/public
   ```

   В `../pna-backend-lr6/example-express/src/index.js` дописать одну
   строку рядом с уже существующим `app.use('/static', ...)`:

   ```js
   app.use(express.static(path.join(__dirname, '../public')));
   ```

   После этого:

   ```bash
   cd ../pna-backend-lr6/example-express
   npm install
   npm start
   ```

   Сервер слушает `http://localhost:3000`, по корню отдаёт собранный
   фронтенд из `public/`, по `/stocks` — JSON API.

   > Бэкенды для ЛР5 (`../pna-backend`, ветка `backend`) и ЛР6
   > (`../pna-backend-lr6`, ветка `backend-bundle`) оба слушают
   > порт 3000, поэтому одновременно работать не могут — запускай по
   > очереди под нужную лабу.

3. **Открыть `http://localhost:3000/` в Chrome без CORS Unblock.**
   Открыть DevTools → Network → фильтр **Fetch/XHR**.

4. На главной ввести строку в поле фильтра, нажать «Найти». В Network
   виден запрос `GET /stocks?title=...`, тип **fetch**, статус 200,
   приходит JSON. **CORS Unblock выключен — всё работает**, потому что
   `Origin` запроса и адрес страницы совпадают (`localhost:3000`).

5. **Через Postman добавить новую запись:**
   `POST http://localhost:3000/stocks`
   ```json
   { "src": "/static/img/1.png", "title": "Демо ЛР6", "text": "..." }
   ```
   Обновить страницу — карточка появилась в общем списке. Ввести её
   название в фильтр — фильтрация подтверждает, что данные действительно
   идут через API.

6. Перейти на карточку → «Редактировать». Изменить любое поле, нажать
   **Сохранить**. В Network виден запрос `PATCH /stocks/:id` с
   `Content-Type: application/json`, статус 200. Вернуться на список —
   изменения сохранены.

7. **Sources в DevTools.** В дереве источников видно только
   `index.html` и `assets/index-XXXX.js` — собранный бандл. Никаких
   `pages/`, `components/`, `modules/` отдельными файлами больше нет —
   Vite склеил их в один файл и минифицировал.

8. **Дополнительно — dev-режим.** В директории на ветке `fetch`
   запустить `npm run dev` и зайти на `http://localhost:5173`.
   Vite-прокси сам перенаправит запросы `/stocks` и `/static` на
   `localhost:3000`, CORS Unblock тоже не нужен. В dev-режиме в Sources
   виден исходный код всех модулей — это тот же фронтенд до сборки.

## 7. Контрольные вопросы

**Что такое Promise.** Объект-обёртка над асинхронной операцией. Имеет
три состояния: `pending` (исходное), `fulfilled` (операция успешно
завершена, результат известен), `rejected` (произошла ошибка). Перейти
из `pending` можно ровно один раз. Цепочка `.then(onFulfilled)`,
`.catch(onRejected)`, `.finally(onSettled)` навешивает обработчики.
Промисы решили проблему «callback hell», когда вложенные асинхронные
вызовы превращали код в пирамиду обратных вызовов: с промисами
последовательность асинхронных шагов записывается линейно через `.then`
или `await`.

**Что такое fetch.** Современная браузерная функция для HTTP-запросов,
возвращающая `Promise<Response>`. В отличие от XHR работает с промисами
из коробки, чище API: `fetch(url, {method, headers, body})`. У `Response`
есть методы `.json()`, `.text()`, `.blob()` — каждый возвращает свой
промис. `fetch` отвергает промис только на сетевых ошибках; HTTP-ошибки
(4xx/5xx) не считаются исключением — статус нужно проверять руками
через `response.ok`.

**Что такое async/await.** Синтаксический сахар над промисами.
Объявление `async function` всегда возвращает промис. Внутри неё `await
expr` дожидается резолва промиса и возвращает его значение —
последующие строки выполняются как «обычный» синхронный код. Ошибки
ловятся `try/catch` так же, как в синхронном коде. Эквивалентно
`.then`-цепочкам, но читаемее, особенно при ветвлениях и циклах.

**Что такое bundler.** Инструмент, склеивающий множество исходных
модулей (JS, CSS, картинки) в один или несколько оптимизированных
файлов — бандлов — для отдачи в браузер. Делает: разрешение импортов,
tree-shaking (удаление неиспользуемого кода), минификацию, hashing
имён файлов под кэш-бастинг, поднимает dev-сервер с горячим
обновлением. Популярные: Webpack, Rollup, Vite, esbuild, Parcel. В
этой работе использован Vite.

**Что такое Babel.** Транспилятор JavaScript: переводит современный JS
(ES2020+, JSX, экспериментальные предложения) в синтаксис, понятный
старым браузерам, через настраиваемые пресеты (`@babel/preset-env`,
`@babel/preset-react`). Часто работает вместе с бандлером как
loader/plugin. Vite по умолчанию использует esbuild и Babel вызывает
только при необходимости (например, через плагины React).

**Что такое TypeScript.** Надстройка над JavaScript, добавляющая
статическую систему типов. Компилируется в чистый JS компилятором
`tsc` (или transpiler-ом бандлера). Типы существуют только на этапе
компиляции — в рантайме их нет. Даёт автокомплит в IDE, ловит ошибки
несоответствия типов до запуска кода, формализует контракты между
модулями. В отличие от Babel, кроме трансляции синтаксиса ещё проверяет
типы.
