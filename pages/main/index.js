import {ProductCardComponent} from "../../components/product-card/index.js";
import {ProductPage} from "../product/index.js";
import {ajax} from "../../modules/ajax.js";
import {stockUrls} from "../../modules/stockUrls.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.titleQuery = '';
    }

    async getData() {
        const query = this.titleQuery ? {title: this.titleQuery} : {};
        try {
            const {data, status, ok} = await ajax.get(stockUrls.getStocks(query));
            if (ok && Array.isArray(data)) {
                this.renderData(data);
            } else {
                this._renderError(`Не удалось загрузить данные (status ${status}).`);
            }
        } catch (err) {
            this._renderError(`Сетевая ошибка: ${err.message}`);
        }
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return (
            `
                <h2 class="text-center mb-4" style="color: #1a3a5c;">Каталог конвейеров</h2>
                <div class="d-flex justify-content-center mb-4">
                    <input id="filter-input" type="text" class="form-control" style="max-width: 400px;"
                           placeholder="Фильтр по названию..." value="${this.titleQuery}">
                    <button id="filter-btn" class="btn btn-primary ms-2">Найти</button>
                </div>
                <div id="main-page" class="row justify-content-center g-4"></div>
            `
        );
    }

    clickCard(e) {
        const cardId = e.target.dataset.id;
        const productPage = new ProductPage(this.parent, cardId);
        productPage.render();
    }

    renderData(items) {
        if (!items.length) {
            this.pageRoot.insertAdjacentHTML(
                'beforeend',
                `<p class="text-muted text-center">Ничего не найдено.</p>`
            );
            return;
        }
        items.forEach((item) => {
            const productCard = new ProductCardComponent(this.pageRoot);
            productCard.render(item, this.clickCard.bind(this));
        });
    }

    _renderError(message) {
        this.pageRoot.insertAdjacentHTML(
            'beforeend',
            `<p class="text-danger">${message}</p>`
        );
    }

    addListeners() {
        const input = document.getElementById('filter-input');
        const btn = document.getElementById('filter-btn');
        const apply = () => {
            this.titleQuery = input.value.trim();
            this.pageRoot.innerHTML = '';
            this.getData();
        };
        btn.addEventListener('click', apply);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') apply();
        });
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        this.addListeners();
        this.getData();
    }
}
