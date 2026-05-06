import {BackButtonComponent} from "../../components/back-button/index.js";
import {ProductPage} from "../product/index.js";
import {ajax} from "../../modules/ajax.js";
import {stockUrls} from "../../modules/stockUrls.js";

export class ProductEditPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    async getData() {
        try {
            const {data, status, ok} = await ajax.get(stockUrls.getStockById(this.id));
            if (ok && data) {
                this.renderForm(data);
            } else {
                this.pageRoot.insertAdjacentHTML(
                    'beforeend',
                    `<p class="text-danger">Не удалось загрузить карточку (status ${status}).</p>`
                );
            }
        } catch (err) {
            this.pageRoot.insertAdjacentHTML(
                'beforeend',
                `<p class="text-danger">Сетевая ошибка: ${err.message}</p>`
            );
        }
    }

    get pageRoot() {
        return document.getElementById('product-edit-page');
    }

    getHTML() {
        return (
            `
                <div id="product-edit-page" class="d-flex flex-column align-items-center"></div>
            `
        );
    }

    clickBack() {
        const productPage = new ProductPage(this.parent, this.id);
        productPage.render();
    }

    renderForm(item) {
        const html = `
            <div class="card p-4 mb-3" style="max-width: 700px; width: 100%;">
                <h4 class="mb-3" style="color:#1a3a5c;">Редактирование карточки #${item.id}</h4>
                <form id="edit-form">
                    <div class="mb-3">
                        <label class="form-label">Название</label>
                        <input id="field-title" type="text" class="form-control"
                               value="${this._escape(item.title || '')}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Описание</label>
                        <textarea id="field-text" class="form-control" rows="4">${this._escape(item.text || '')}</textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Картинка (URL)</label>
                        <input id="field-src" type="text" class="form-control"
                               value="${this._escape(item.src || '')}">
                    </div>
                    <button type="submit" id="save-btn" class="btn btn-primary">Сохранить</button>
                    <span id="save-status" class="ms-3"></span>
                </form>
            </div>
        `;
        this.pageRoot.insertAdjacentHTML('beforeend', html);

        document
            .getElementById('edit-form')
            .addEventListener('submit', this._onSubmit.bind(this));
    }

    async _onSubmit(event) {
        event.preventDefault();
        const payload = {
            title: document.getElementById('field-title').value,
            text: document.getElementById('field-text').value,
            src: document.getElementById('field-src').value,
        };
        const status = document.getElementById('save-status');
        status.textContent = 'Сохранение…';
        status.className = 'ms-3 text-muted';

        try {
            const {ok, status: code} = await ajax.patch(
                stockUrls.updateStockById(this.id),
                payload,
            );
            if (ok) {
                status.textContent = 'Сохранено';
                status.className = 'ms-3 text-success';
            } else {
                status.textContent = `Ошибка (${code})`;
                status.className = 'ms-3 text-danger';
            }
        } catch (err) {
            status.textContent = `Сетевая ошибка: ${err.message}`;
            status.className = 'ms-3 text-danger';
        }
    }

    _escape(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('"', '&quot;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;');
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        this.getData();
    }
}
