import {mergeConveyorThroughput} from "../../utils/merge-throughput.js";
import {inverseConveyorStages} from "../../utils/inverse-stages.js";

export class ProductionReportComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getData() {
        return {
            throughput: [[120, 340, 210], [55, 410, 260], [305, 88, 430]],
            stages: ["Подача сырья", "Сортировка", "Контроль", "Упаковка", "Отгрузка"],
            queue: [
                "СТАРТ: запустить привод",
                "ДАТЧИК: заготовка на позиции 3",
                "СТОП",
                "ИГНОР: после СТОП не читается"
            ]
        };
    }

    readUntilStop(queue) {
        const log = [];
        let i = 0;
        let msg;
        do {
            msg = queue[i];
            log.push(`#${i + 1}: ${msg}`);
            i++;
        } while (msg !== "СТОП" && i < queue.length);
        return log;
    }

    render() {
        const data = this.getData();
        const text = [
            "Производительность по всем линиям (по убыванию):",
            mergeConveyorThroughput(...data.throughput),
            "",
            "Этапы в режиме демонтажа (первые 2 этапа пуска сохранены):",
            inverseConveyorStages(data.stages, 2).join(" → "),
            "",
            "Лог контроллера (до сигнала СТОП):",
            ...this.readUntilStop(data.queue)
        ].join("\n");

        this.parent.insertAdjacentHTML("beforeend", `
            <section class="production-report">
                <h3 class="production-report__title">Отчёт по производственной линии</h3>
                <pre class="production-report__body">${text}</pre>
            </section>
        `);
    }
}
