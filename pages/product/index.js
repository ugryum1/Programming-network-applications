import {ProductComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";
import { ButtonGroupComponent } from "../../components/button-group/index.js";

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
                title: "Уличная фотография",
                text: "Профессиональный кадр, сделанный в городском стиле."
            },
            {
                id: 2,
                src: "static/img/2.png",
                title: "Пейзаж",
                text: "Красота природы в объективе мастера."
            },
            {
                id: 3,
                src: "static/img/3.png",
                title: "Макросъемка",
                text: "Удивительные детали, невидимые невооруженным глазом."
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
                <div id="product-page"></div>
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

        const buttonGroup = new ButtonGroupComponent(this.pageRoot)
        buttonGroup.render()
    }
}
