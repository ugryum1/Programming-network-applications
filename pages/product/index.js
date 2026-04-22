import {ProductComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";
import { ButtonGroupComponent } from "../../components/button-group/index.js";
import {ConveyorViewerComponent} from "../../components/conveyor-viewer/index.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
    }

    getData() {
        const data = [
            {
                id: 1,
                src: "static/img/1.png",
                title: "Ленточный конвейер",
                text: "Применяется для непрерывной транспортировки сыпучих материалов и штучных грузов. Производительность до 500 т/ч, длина до 300 м."
            },
            {
                id: 2,
                src: "static/img/2.png",
                title: "Роликовый конвейер",
                text: "Предназначен для перемещения тарных и штучных грузов на складах и в логистических центрах. Грузоподъёмность до 1000 кг/м."
            },
            {
                id: 3,
                src: "static/img/3.png",
                title: "Цепной конвейер",
                text: "Обеспечивает надёжную транспортировку тяжёлых изделий в металлургии и машиностроении. Рабочая температура до +500°C."
            },
            {
                id: 4,
                src: "static/img/4.png",
                title: "Подвесной конвейер",
                text: "Экономит производственную площадь за счёт транспортировки в верхней зоне цеха. Грузоподъёмность до 500 кг на подвеску."
            }
        ];

        return data.find(item => item.id == this.id)
    }

    get pageRoot() {
        return document.getElementById('product-page')
    }

    getHTML() {
        return (
            `
                <div id="product-page" class="d-flex flex-column align-items-center"></div>
            `
        )
    }

    clickBack() {
        const mainPage = new MainPage(this.parent)
        mainPage.render()
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const backButton = new BackButtonComponent(this.pageRoot)
        backButton.render(this.clickBack.bind(this))

        const data = this.getData()
        const stock = new ProductComponent(this.pageRoot)
        stock.render(data)

        const viewer = new ConveyorViewerComponent(this.pageRoot, `static/models/${data.id}.glb`)
        viewer.render()

        const buttonGroup = new ButtonGroupComponent(this.pageRoot)
        buttonGroup.render()
    }
}
