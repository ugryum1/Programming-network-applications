import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";

const CONVEYOR_PRESETS = [
    {id: 1, title: "Ленточный конвейер", model: "static/models/1.glb"},
    {id: 2, title: "Роликовый конвейер", model: "static/models/2.glb"},
    {id: 3, title: "Цепной конвейер", model: "static/models/3.glb"},
    {id: 4, title: "Подвесной конвейер", model: "static/models/4.glb"}
];

const params = new URLSearchParams(window.location.search);
const presetId = params.get("id");
const userId = params.get("user");
const titleEl = document.getElementById("model-title");

let camera, controls;

if (presetId) {
    const preset = CONVEYOR_PRESETS.find(p => p.id === Number(presetId));
    if (preset) {
        renderViewer(preset.title, {model: preset.model});
    } else {
        titleEl.textContent = "Конвейер не найден";
    }
} else if (userId) {
    getConveyorByIdFromDB(userId).then(user => {
        if (!user) {
            titleEl.textContent = "Модель не найдена";
            return;
        }
        renderViewer(user.title, {buffer: user.buffer});
    });
} else {
    titleEl.textContent = "Нет данных";
}

function renderViewer(title, source) {
    titleEl.textContent = title;

    const canvas = document.getElementById("viewer-canvas");
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(4, 10, 8);
    scene.add(dirLight);

    const loader = new GLTFLoader();
    const onLoad = gltf => scene.add(gltf.scene);
    if (source.model) {
        loader.load(source.model, onLoad);
    } else if (source.buffer) {
        loader.parse(source.buffer, "", onLoad, () => alert("Не удалось загрузить модель"));
    }

    document.getElementById("zoom-in").onclick = () => moveAlongView(-0.5);
    document.getElementById("zoom-out").onclick = () => moveAlongView(0.5);
    document.getElementById("view-front").onclick = () => setDirection("front");
    document.getElementById("view-back").onclick = () => setDirection("back");
    document.getElementById("view-left").onclick = () => setDirection("left");
    document.getElementById("view-right").onclick = () => setDirection("right");

    window.addEventListener("resize", () => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });

    (function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    })();
}

function moveAlongView(delta) {
    const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
    camera.position.addScaledVector(dir, delta);
    controls.update();
}

function setDirection(dir) {
    const d = camera.position.distanceTo(controls.target);
    const coords = {
        front: [0, 2, d],
        back: [0, 2, -d],
        left: [-d, 2, 0],
        right: [d, 2, 0]
    }[dir];
    camera.position.set(...coords);
    controls.target.set(0, 1, 0);
    controls.update();
}
