let camera;
let webGLRenderer;
let body;
let roof;
let cylinder1;
let cylinder2;
let cube1;
let cube2;
let base;
let resultBSP;
let result;

function addRenderer(){
  webGLRenderer = new THREE.WebGLRenderer();
  webGLRenderer.setClearColor(new THREE.Color(0x222222));
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMap.enabled = true;
}

function addCamera(){
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = -20;
  camera.position.y = 10;
  camera.position.z = 40;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

}

function addAmbientLight(){
  const ambiLight = new THREE.AmbientLight(0x777777);
  scene.add(ambiLight);
}

function addSpotLight(){
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 60, 0);
  spotLight.intensity = 2.0;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2000;
  spotLight.shadow.mapSize.height = 2000;

  scene.add(spotLight);
}

function addGeometry(){
  body = createMesh(new THREE.BoxGeometry(10, 10, 10));
  body.position.set(-5, 0, -5);
  body.castShadow = true;

  roof = createMesh(new THREE.SphereGeometry(5.0, 15, 30));
  roof.position.set(-5, 4, -5);
  roof.castShadow = true;

  cylinder1 = createMesh(new THREE.CylinderGeometry(4, 4, 15, 20));
  cylinder1.position.set(-5, 0, -5);
  cylinder1.rotation.x = -0.5 * Math.PI;
  cylinder1.castShadow = true;

  cube1 = createMesh(new THREE.BoxGeometry(8, 6, 20));
  cube1.position.set(-5, -2, -3);
  cube1.castShadow = true;

  cylinder2 = createMesh(new THREE.CylinderGeometry(4, 4, 10, 20));
  cylinder2.position.set(-5, 0, -5);
  cylinder2.rotation.z = -0.5 * Math.PI;
  cylinder2.castShadow = true;

  cube2 = createMesh(new THREE.BoxGeometry(15, 6, 8));
  cube2.position.set(-3, -2, -5);
  cylinder2.rotation.z = -0.5 * Math.PI;
  cube2.castShadow = true;
}

function addBase(){
  base = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 0.5), new THREE.MeshPhongMaterial({
    color: 0x002200
  }));

  base.position.x = 0;
  base.position.y = -10;
  base.rotation.x = -0.4 * Math.PI;
  base.receiveShadow = true;

  scene.add(base);
}

function makeComplex(){
  const roofBSP = new ThreeBSP(roof);
  const bodyBSP = new ThreeBSP(body);
  const cylinder1BSP = new ThreeBSP(cylinder1);
  const cube1BSP = new ThreeBSP(cube1);
  const cylinder2BSP = new ThreeBSP(cylinder2);
  const cube2BSP = new ThreeBSP(cube2);

  resultBSP = bodyBSP.union(roofBSP);
  resultBSP = resultBSP.subtract(cube1BSP);
  resultBSP = resultBSP.subtract(cylinder1BSP);
  resultBSP = resultBSP.subtract(cylinder2BSP);
  resultBSP = resultBSP.subtract(cube2BSP);
}

function createMesh(geom) {
  const texture = new THREE.TextureLoader().load("./brick.jpg");

  const meshMaterial = new THREE.MeshLambertMaterial(
    { color: 0x2194CE }
    );
  meshMaterial.side = THREE.DoubleSide;
  meshMaterial.wireframe = false;

  const mesh = new THREE.Mesh(geom, meshMaterial);

  return mesh;
}

function redrawResult() {
  makeComplex();

  result = resultBSP.toMesh();
  result.material=new THREE.MeshPhongMaterial({color: 0xff9900});
  result.castShadow = true;

  scene.add(result);

  return;
}

function render() {
  result.rotation.x += 0.005;
  result.rotation.y += 0.005;
  result.rotation.z -= 0.005;

  requestAnimationFrame(render);
  webGLRenderer.render(scene, camera);
}

const scene = new THREE.Scene();

addCamera();
addAmbientLight();
addSpotLight();
addRenderer();
addGeometry();
addBase();
makeComplex();

document.getElementById("WebGL-div").appendChild(webGLRenderer.domElement);

redrawResult();

render();

