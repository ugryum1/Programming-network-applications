import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {mergeConveyorThroughput} from "./utils/merge-throughput.js";
import {inverseConveyorStages} from "./utils/inverse-stages.js";

const CONVEYOR_PRESETS = [
    {id: 1, title: "Ленточный конвейер", model: "static/models/1.glb"},
    {id: 2, title: "Роликовый конвейер", model: "static/models/2.glb"},
    {id: 3, title: "Цепной конвейер", model: "static/models/3.glb"},
    {id: 4, title: "Подвесной конвейер", model: "static/models/4.glb"}
];

const cardList = document.getElementById("card-list");
const reportBody = document.getElementById("report-body");

let userConveyors = [];
let presetsOrder = [...CONVEYOR_PRESETS];

getAllConveyorsFromDB().then(stored => {
    userConveyors = stored;
    renderCards();
});

function renderCards() {
    cardList.innerHTML = "";
    presetsOrder.forEach(conveyor => addCard(conveyor, false));
    userConveyors.forEach(conveyor => addCard(conveyor, true));
}

function addCard(conveyor, isUser) {
    const card = document.createElement("div");
    card.className = "card";
    card.tabIndex = 0;

    const previewCanvas = document.createElement("canvas");
    previewCanvas.className = "preview-canvas";
    previewCanvas.width = 180;
    previewCanvas.height = 180;
    card.appendChild(previewCanvas);

    renderConveyorPreview(conveyor, isUser, previewCanvas);

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = conveyor.title || "Загруженная модель";
    card.appendChild(title);

    card.onclick = () => {
        const param = isUser ? `user=${conveyor.id}` : `id=${conveyor.id}`;
        window.location.href = `detail.html?${param}`;
    };

    cardList.appendChild(card);
}

function normalizeToFloor(obj) {
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    obj.position.x -= center.x;
    obj.position.z -= center.z;
    obj.position.y -= box.min.y;
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) obj.scale.multiplyScalar(1.1 / maxDim);
}

function renderConveyorPreview(conveyor, isUser, canvas) {
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setClearColor(0xf5f5f5, 1);
    renderer.setSize(canvas.width, canvas.height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(0, 0.7, 2);

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(2, 6, 4);
    scene.add(light);

    const loader = new GLTFLoader();
    const onLoad = gltf => {
        const obj = gltf.scene;
        normalizeToFloor(obj);
        scene.add(obj);
        renderer.render(scene, camera);
    };

    if (isUser && conveyor.buffer) {
        loader.parse(conveyor.buffer, "", onLoad, () => drawFallback(canvas));
    } else if (conveyor.model) {
        loader.load(conveyor.model, onLoad, undefined, () => drawFallback(canvas));
    } else {
        drawFallback(canvas);
    }
}

function drawFallback(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#e5e5e5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#666";
    ctx.font = "52px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🧩", canvas.width / 2, canvas.height / 2);
}

document.getElementById("reverse-order").addEventListener("click", () => {
    presetsOrder = inverseConveyorStages(presetsOrder, 1);
    renderCards();
});

document.getElementById("uploadModel").addEventListener("change", (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const conveyor = {title: file.name, buffer: e.target.result, filename: file.name};
            addConveyorToDB(conveyor).then(id => {
                conveyor.id = id;
                userConveyors.push(conveyor);
                renderCards();
            });
        };
        reader.readAsArrayBuffer(file);
    });
});

function buildProductionReport() {
    const report = {
        throughput: {
            "Ленточный": [120, 340, 210, 175],
            "Роликовый": [55, 410, 95, 260],
            "Цепной": [305, 88, 430]
        },
        stages: ["Подача сырья", "Сортировка", "Контроль", "Упаковка", "Отгрузка"],
        controllerQueue: [
            "СТАРТ: запустить привод",
            "ДАТЧИК: заготовка на позиции 3",
            "РОЛИК: скорость 1.2 м/с",
            "СТОП",
            "ИГНОР: после СТОП не читается"
        ]
    };

    const throughputArrays = Object.values(report.throughput);
    const topThroughput = mergeConveyorThroughput(...throughputArrays);
    const reversedStages = inverseConveyorStages(report.stages, 2);

    const log = [];
    let i = 0;
    let message;
    do {
        message = report.controllerQueue[i];
        log.push(`#${i + 1}: ${message}`);
        i++;
    } while (message !== "СТОП" && i < report.controllerQueue.length);

    return [
        "Производительность по всем линиям (т/ч, по убыванию):",
        topThroughput,
        "",
        "Этапы в режиме демонтажа (первые 2 этапа пуска сохранены):",
        reversedStages.join(" → "),
        "",
        "Лог контроллера (до сигнала СТОП):",
        ...log
    ].join("\n");
}

reportBody.textContent = buildProductionReport();
