import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, clock, controls;

const objects = [];
const sol = [];

const speed = 1;
const height = 3;
const offset = 0.5;

function init() {
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  // Creación de camara.
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  // Añado imagen al fondo.
  const textureLoader = new THREE.TextureLoader();
  scene.background = textureLoader.load("/img/f1.jpg");

  // Permito controlar la camara con el mouse.
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 25;

  camera.position.set(7, 3, 7);
  controls.update();

  // Luz.
  const ambientLight = new THREE.AmbientLight(0x3A3938,1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xA4A4A4 , 2);
  directionalLight.position.set(-20, 20, 1);
  scene.add(directionalLight);
  
  const d = 5;
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 20;

  directionalLight.shadow.mapSize.x = 1024;
  directionalLight.shadow.mapSize.y = 1024;

  // Suelo.
  const floorTexture = textureLoader.load("/img/chess.jpg");

  const floorGeometry = new THREE.PlaneGeometry(10, 10);
  const floorMaterial = new THREE.MeshLambertMaterial({ map: floorTexture });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = Math.PI * -0.5;
  floor.receiveShadow = true;
  scene.add(floor);

  // Objetos.
  const ballTexture = textureLoader.load("/img/nebula.jpg");

  const count = 6;
  const radius = 3;

  const ballGeometry = new THREE.SphereGeometry(0.5, 32, 16);
  ballGeometry.translate(0, 0.3, 0);
  const ballMaterial = new THREE.MeshLambertMaterial({ map: ballTexture });

  for (let i = 0; i < count; i++) {
    const s = (i / count) * Math.PI * 2;

    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.castShadow = true;
    ball.userData.down = false;

    ball.position.x = radius * Math.cos(s);
    ball.position.z = radius * Math.sin(s);

    scene.add(ball);
    objects.push(ball);
  }

  // luces moviles
  const bgeom = new THREE.SphereGeometry(0.1, 32, 16);

  const pointLight1 = new THREE.PointLight(0xE46100,60);
  pointLight1.position.set(0,1.5,0);
  pointLight1.castShadow = true;
  const bLightMat = new THREE.MeshLambertMaterial({
    emissive: 0xE46100,
    emissiveIntensity: 60,
    color: 0x000000});

  pointLight1.add(new THREE.Mesh(bgeom,bLightMat))
  scene.add(pointLight1)
  sol.push(pointLight1)

  const pointLight2 = new THREE.PointLight(0x0CF00F,30);
  pointLight2.position.set(-3.5,1.5,-3.5);
  pointLight2.castShadow = true;
  const bLightMat2 = new THREE.MeshLambertMaterial({
    emissive: 0x0CF00F,
    emissiveIntensity: 30,
    color: 0x000000});

  pointLight2.add(new THREE.Mesh(bgeom,bLightMat2))
  scene.add(pointLight2)
  sol.push(pointLight2)

  const pointLight3 = new THREE.PointLight(0x0046FF,30);
  pointLight3.position.set(3.5,1.5,3.5);
  pointLight3.castShadow = true;
  const bLightMat3 = new THREE.MeshLambertMaterial({
    emissive: 0x0046FF,
    emissiveIntensity: 30,
    color: 0x000000});

  pointLight3.add(new THREE.Mesh(bgeom,bLightMat3))
  scene.add(pointLight3)
  sol.push(pointLight3)

  animate();
}

// Renderizado de la escena.
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.useLegacyLights = false;
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

// Animación.
function render() {
  const time = clock.getElapsedTime();
  
  for (let i = 0; i < sol.length; i++) {
    const luz = sol[i]
    const previousHeight = luz.position.y;
      luz.position.y = Math.abs(Math.sin(i * offset + time * speed) * height);

      if (luz.position.y < previousHeight) {
        luz.userData.down = true;
      } else {
        if (luz.userData.down === true) {
          // ball changed direction from down to up
          luz.userData.down = false;
        }
      }
    }

  for (let i = 0; i < objects.length; i++) {
    const ball = objects[i];
    ball.rotateY(0.004);
    const previousHeight = ball.position.y;
    ball.position.y = Math.abs(Math.sin(i*offset + time * speed) * height);

    if (ball.position.y < previousHeight) {
      ball.userData.down = true;
    } else {
      if (ball.userData.down === true) {
        // ball changed direction from down to up
        ball.userData.down = false;
      }
    }
  }

  renderer.render(scene, camera);
}

init();
