export class ButtonGroupComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <div class="btn-group mt-3" role="group" aria-label="Действия с конвейером">
                <button type="button" class="btn btn-outline-primary">Заказать</button>
                <button type="button" class="btn btn-outline-secondary">В сравнение</button>
                <button type="button" class="btn btn-outline-success">Скачать PDF</button>
            </div>
        `;
    }

    render() {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
