export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return (
            `
                <div class="col-md-6 col-lg-3">
                    <div class="card h-100">
                        <img class="card-img-top" src="${data.src}" alt="${data.title}"
                             style="height: 220px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${data.title}</h5>
                            <p class="card-text text-muted flex-grow-1">${data.text}</p>
                            <button class="btn btn-primary mt-auto" id="click-card-${data.id}"
                                    data-id="${data.id}">Подробнее</button>
                        </div>
                    </div>
                </div>
            `
        )
    }

    addListeners(data, listener) {
        document
            .getElementById(`click-card-${data.id}`)
            .addEventListener("click", listener)
    }

    render(data, listener) {
        const html = this.getHTML(data)
        this.parent.insertAdjacentHTML('beforeend', html)
        this.addListeners(data, listener)
    }
}
