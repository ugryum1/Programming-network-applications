import {ProductComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";
import {ButtonGroupComponent} from "../../components/button-group/index.js";
import {ProductEditPage} from "../product-edit/index.js";
import {ajax} from "../../modules/ajax.js";
import {stockUrls} from "../../modules/stockUrls.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    async getData() {
        try {
            const {data, status, ok} = await ajax.get(stockUrls.getStockById(this.id));
            if (ok && data) {
                this.renderData(data);
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
        return document.getElementById('product-page');
    }

    getHTML() {
        return (
            `
                <div id="product-page" class="d-flex flex-column align-items-center"></div>
            `
        );
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    clickEdit() {
        const editPage = new ProductEditPage(this.parent, this.id);
        editPage.render();
    }

    renderData(item) {
        const stock = new ProductComponent(this.pageRoot);
        stock.render(item);

        this.pageRoot.insertAdjacentHTML(
            'beforeend',
            `<button id="edit-button" class="btn btn-primary mb-3">Редактировать</button>`
        );
        document
            .getElementById('edit-button')
            .addEventListener('click', this.clickEdit.bind(this));

        const buttonGroup = new ButtonGroupComponent(this.pageRoot);
        buttonGroup.render();
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
