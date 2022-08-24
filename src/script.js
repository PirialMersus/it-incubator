import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import testVertexShader from "./shaders/vertex.glsl";
import testFragmentShader from "./shaders/fragment.glsl";
import flag from './../static/textures/ukraine_flag.jpg'
import matCap1 from "../static/textures/matcaps/1.png";
import matCap2 from "../static/textures/matcaps/2.png";
import matCap3 from "../static/textures/matcaps/3.png";
import matCap4 from "../static/textures/matcaps/4.png";
import matCap5 from "../static/textures/matcaps/5.png";
import matCap6 from "../static/textures/matcaps/6.png";
import matCap7 from "../static/textures/matcaps/7.png";
import matCap8 from "../static/textures/matcaps/8.png";
import matCap9 from "../static/fonts/helvetiker_regular.typeface.json";

// console.log(matCap10);

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const flagTexture = textureLoader.load(flag);

const matcapTexture = textureLoader.load(matCap3);
const matcapTexturesArr = [
  textureLoader.load(matCap1),
  textureLoader.load(matCap2),
  textureLoader.load(matCap3),
  textureLoader.load(matCap4),
  textureLoader.load(matCap5),
  textureLoader.load(matCap6),
  textureLoader.load(matCap7),
  textureLoader.load(matCap8),
];

//fonts
const fontLoader = new THREE.FontLoader();
const font = fontLoader.parse(matCap9);

const textGeometry = new THREE.TextBufferGeometry("Happy independence day of Ukraine", {
  font,
  size: 0.05,
  height: 0.02,
  curveSegments: 2,
  bevelEnabled: true,
  bevelThickness: 0.001,
  bevelSize: 0.002,
  bevelOffset: 0,
  bevelSegments: 4,
});
//   textGeometry.computeBoundingBox();
//   textGeometry.translate(
//     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
//     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
//     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
//   );
textGeometry.center();

const material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture,
});
const text = new THREE.Mesh(textGeometry, material);
scene.add(text);

const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
for (let i = 0; i < 10000; i++) {
  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexturesArr[Math.round(Math.random() * 8)],
  });
  const donut = new THREE.Mesh(donutGeometry, material);

  donut.position.x = (Math.random() - 0.5) * 200;
  donut.position.y = (Math.random() - 0.5) * 200;
  donut.position.z = (Math.random() - 0.5) * 200;

  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;

  const scale = Math.random();
  donut.scale.x = scale;
  donut.scale.y = scale;
  donut.scale.z = scale;

  scene.add(donut);
}


const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}
geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

const flagMaterial = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  // wireframe: true,
  side: THREE.DoubleSide,
  // transparent: true,
  uniforms: {
    uFrequency: {value: new THREE.Vector3(10, 5)},
    uTime: {value: 0},
    uColor: {value: new THREE.Color('orange')},
    uTexture: {value: flagTexture}
  },
});

// Mesh
const mesh = new THREE.Mesh(geometry, flagMaterial);
mesh.scale.y = 2 / 3;
mesh.position.z = -0.4
// mesh.scale.x = 9
// mesh.scale.y = 9
// mesh.scale.z = 9
scene.add(mesh);



/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0.7;
camera.position.y = 0.2;
camera.position.z = 0.5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // material.uniforms.uTime.value = clock.getElapsedTime();
  flagMaterial.uniforms.uTime.value = clock.getElapsedTime();
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
