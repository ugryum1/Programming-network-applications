export class ButtonGroupComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getTabsData() {
        return [
            {
                id: "about",
                label: "О продукте",
                content: "Конвейерное оборудование предназначено для автоматизации транспортировки грузов на производственных и складских объектах. Обеспечивает непрерывное перемещение материалов с минимальными затратами ручного труда. Подходит для работы в различных климатических условиях и производственных средах."
            },
            {
                id: "specs",
                label: "Технические характеристики",
                content: "Длина: от 1 до 300 м. Ширина ленты/рабочей поверхности: от 200 до 2000 мм. Скорость транспортировки: от 0,1 до 3,15 м/с. Грузоподъёмность: до 1000 кг/м. Рабочая температура: от −40°C до +500°C. Электропитание: 380 В, 50 Гц."
            },
            {
                id: "options",
                label: "Опции",
                content: "Частотный преобразователь для регулировки скорости. Боковые направляющие и борта. Датчики контроля схода ленты. Пылезащитные кожухи. Система автоматической смазки. Интеграция с АСУ ТП предприятия."
            }
        ];
    }

    getHTML() {
        const tabs = this.getTabsData();
        const buttons = tabs.map((tab, i) =>
            `<button type="button" class="tab-btn${i === 0 ? ' active' : ''}" data-tab="${tab.id}">${tab.label}</button>`
        ).join('');

        const panels = tabs.map((tab, i) =>
            `<div class="tab-content-panel" id="tab-panel-${tab.id}" style="${i !== 0 ? 'display:none;' : ''}">${tab.content}</div>`
        ).join('');

        return `
            <div class="product-tabs">${buttons}</div>
            ${panels}
        `;
    }

    addListeners() {
        const tabBtns = this.parent.querySelectorAll('.tab-btn');
        const panels = this.parent.querySelectorAll('.tab-content-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                panels.forEach(p => p.style.display = 'none');

                btn.classList.add('active');
                const panel = this.parent.querySelector(`#tab-panel-${btn.dataset.tab}`);
                if (panel) panel.style.display = 'block';
            });
        });
    }

    render() {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners();
    }
}
