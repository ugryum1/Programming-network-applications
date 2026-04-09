# Отчёт по ЛР 3. Простое веб-приложение

**Вариант 7** — тема: конвейеры, компонент: группа кнопок.

## Навигация по отчёту

- [Структура проекта](#структура-проекта)
- [Что сделано](#что-сделано)
  - [1. Инициализация проекта](#1-инициализация-проекта)
  - [2. Главная страница (index.html)](#2-главная-страница-indexhtml)
  - [3. Точка входа (main.js)](#3-точка-входа-mainjs)
  - [4. Страница каталога (pages/main/index.js)](#4-страница-каталога-pagesmainindexjs)
  - [5. Компонент карточки (components/product-card/index.js)](#5-компонент-карточки-componentsproduct-cardindexjs)
  - [6. Страница товара (pages/product/index.js)](#6-страница-товара-pagesproductindexjs)
  - [7. Группа кнопок — компонент по варианту (components/button-group/index.js)](#7-группа-кнопок--компонент-по-варианту-componentsbutton-groupindexjs)
  - [8. Навигация между страницами](#8-навигация-между-страницами)
- [Итог](#итог)

## Структура проекта

```
├── index.html
├── main.js
├── pages/
│   ├── main/index.js        — главная страница (каталог)
│   └── product/index.js     — страница товара
├── components/
│   ├── product-card/index.js — карточка конвейера
│   ├── product/index.js      — детальный вид конвейера
│   ├── button-group/index.js — группа кнопок (компонент по варианту)
│   └── back-button/index.js  — кнопка «Назад»
├── package.json
└── .gitignore
```

## Что сделано

### 1. Инициализация проекта

Создан npm-проект, установлен Bootstrap:

```bash
npm init
npm i bootstrap
```

### 2. Главная страница (index.html)

Подключён Bootstrap, добавлен навбар в индустриальном стиле и кастомные стили:

```html
<nav class="navbar navbar-dark navbar-custom mb-4">
    <div class="container">
        <span class="navbar-brand mb-0 h1">Конвейерное оборудование</span>
    </div>
</nav>
<div id="root" class="container"></div>
```

Стили оформлены в промышленной сине-белой гамме (цвета `#1a3a5c`, `#1a6bb5`), карточки с тенью и hover-эффектом.

### 3. Точка входа (main.js)

```js
import {MainPage} from "./pages/main/index.js";
const root = document.getElementById('root');
const mainPage = new MainPage(root);
mainPage.render();
```

### 4. Страница каталога (pages/main/index.js)

Содержит массив из 4 конвейеров и отрисовывает их через `ProductCardComponent`:

```js
getData() {
    return [
        { id: 1, src: "...", title: "Ленточный конвейер", text: "..." },
        { id: 2, src: "...", title: "Роликовый конвейер", text: "..." },
        { id: 3, src: "...", title: "Цепной конвейер", text: "..." },
        { id: 4, src: "...", title: "Подвесной конвейер", text: "..." },
    ]
}

render() {
    this.parent.innerHTML = ''
    this.parent.insertAdjacentHTML('beforeend', this.getHTML())
    this.getData().forEach((item) => {
        const productCard = new ProductCardComponent(this.pageRoot)
        productCard.render(item, this.clickCard.bind(this))
    })
}
```

Карточки центрированы с помощью Bootstrap-классов `row justify-content-center g-4`.

### 5. Компонент карточки (components/product-card/index.js)

Адаптивная сетка (`col-md-6 col-lg-3`), одинаковая высота карточек (`h-100`), кнопка «Подробнее» с обработчиком:

```js
getHTML(data) {
    return `
        <div class="col-md-6 col-lg-3">
            <div class="card h-100">
                <img class="card-img-top" src="${data.src}" ...>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${data.title}</h5>
                    <p class="card-text text-muted">${data.text}</p>
                    <button class="btn btn-primary mt-auto"
                            id="click-card-${data.id}" data-id="${data.id}">Подробнее</button>
                </div>
            </div>
        </div>`;
}
```

### 6. Страница товара (pages/product/index.js)

При клике на карточку открывается детальная страница с `ProductComponent`, `BackButtonComponent` и `ButtonGroupComponent`:

```js
render() {
    this.parent.innerHTML = ''
    this.parent.insertAdjacentHTML('beforeend', this.getHTML())

    new BackButtonComponent(this.pageRoot).render(this.clickBack.bind(this))
    new ProductComponent(this.pageRoot).render(this.getData())
    new ButtonGroupComponent(this.pageRoot).render()
}
```

### 7. Группа кнопок — компонент по варианту (components/button-group/index.js)

Реализованы горизонтальные вкладки в стиле conveer.ru с тремя разделами: «О продукте», «Технические характеристики», «Опции». При нажатии на вкладку отображается соответствующий контент:

```js
getHTML() {
    const tabs = this.getTabsData();
    const buttons = tabs.map((tab, i) =>
        `<button class="tab-btn${i === 0 ? ' active' : ''}" data-tab="${tab.id}">${tab.label}</button>`
    ).join('');
    const panels = tabs.map((tab, i) =>
        `<div class="tab-content-panel" id="tab-panel-${tab.id}" style="${i !== 0 ? 'display:none;' : ''}">${tab.content}</div>`
    ).join('');
    return `<div class="product-tabs">${buttons}</div>${panels}`;
}
```

Активная вкладка выделяется синей верхней границей и белым фоном. Переключение реализовано через `addEventListener` на каждой кнопке.

### 8. Навигация между страницами

Переход на страницу товара — по клику на кнопку карточки через `addEventListener`. Возврат — через кнопку «Назад к каталогу», которая создаёт новый `MainPage` и вызывает `render()`.

## Итог

Реализовано двухстраничное SPA-приложение на тему конвейерного оборудования с использованием vanilla JS (ES6-модули, классы) и Bootstrap 5. Применён компонентный подход: страницы состоят из переиспользуемых компонентов, данные передаются через параметры методов.
