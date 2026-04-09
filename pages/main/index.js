import {ProductCardComponent} from "../../components/product-card/index.js";
import {ProductPage} from "../product/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getData() {
        return [
            {
                id: 1,
                src: "static/img/1.png",
                title: "Ленточный конвейер",
                text: "Универсальное решение для транспортировки сыпучих и штучных грузов на производстве."
            },
            {
                id: 2,
                src: "static/img/2.png",
                title: "Роликовый конвейер",
                text: "Идеален для перемещения коробок, паллет и тяжёлых грузов на складах."
            },
            {
                id: 3,
                src: "static/img/3.png",
                title: "Цепной конвейер",
                text: "Надёжная транспортировка тяжёлых изделий в металлургии и машиностроении."
            },
            {
                id: 4,
                src: "static/img/4.png",
                title: "Подвесной конвейер",
                text: "Экономия площади за счёт транспортировки грузов в верхней зоне цеха."
            },
        ]
    }

    get pageRoot() {
        return document.getElementById('main-page')
    }

    getHTML() {
        return (
            `
                <h2 class="text-center mb-4" style="color: #1a3a5c;">Каталог конвейеров</h2>
                <div id="main-page" class="row justify-content-center g-4"></div>
            `
        )
    }

    clickCard(e) {
        const cardId = e.target.dataset.id

        const productPage = new ProductPage(this.parent, cardId)
        productPage.render()
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const data = this.getData()
        data.forEach((item) => {
            const productCard = new ProductCardComponent(this.pageRoot)
            productCard.render(item, this.clickCard.bind(this))
        })
    }
}
