import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

export class ConveyorViewerComponent {
    constructor(parent, modelUrl) {
        this.parent = parent;
        this.modelUrl = modelUrl;
    }

    getHTML() {
        return `
            <div class="conveyor-viewer">
                <div class="conveyor-viewer__title">3D-модель конвейера</div>
                <div id="conveyor-canvas" class="conveyor-viewer__canvas"></div>
                <div class="conveyor-viewer__hint">Левая кнопка мыши — вращение, колесо — зум.</div>
            </div>
        `;
    }

    init() {
        const host = document.getElementById("conveyor-canvas");
        const width = host.clientWidth || 600;
        const height = 360;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf7f7f7);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(4, 3, 5);

        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        host.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const light = new THREE.DirectionalLight(0xffffff, 0.9);
        light.position.set(5, 8, 4);
        scene.add(light);

        new GLTFLoader().load(this.modelUrl, (gltf) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            model.scale.setScalar(3 / Math.max(size.x, size.y, size.z));
            scene.add(model);
        });

        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();
    }

    render() {
        this.parent.insertAdjacentHTML("beforeend", this.getHTML());
        this.init();
    }
}
