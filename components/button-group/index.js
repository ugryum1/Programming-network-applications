export class ButtonGroupComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <div class="btn-group mt-3" role="group" aria-label="Действия с фото">
                <button type="button" class="btn btn-outline-primary">Лайк</button>
                <button type="button" class="btn btn-outline-secondary">Сохранить</button>
                <button type="button" class="btn btn-outline-success">Поделиться</button>
            </div>
        `;
    }

    render() {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
