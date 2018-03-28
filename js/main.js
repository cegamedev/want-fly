
import * as THREE from 'libs/three.js'
import AirPlane from 'npc/airplan.js'
import EnemyPlane from 'npc/enemy.js'

/**
 * 游戏主函数
 */

//COLORS
var Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xF5986E,
  brownDark: 0x23190f,
  blue: 0x68c3c0,
};

// THREEJS RELATED VARIABLES

var scene,
  camera, fieldOfView, aspectRatio, nearPlane, farPlane,
  renderer, container;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH,
  mousePos = { x: -100, y: 0 };

// LIGHTS
var ambientLight, hemisphereLight, shadowLight;

// 3D Models
var sea;
var airplane;
var enemyplane;
var sky;

let ctx = canvas.getContext('webgl')

class Cloud {

  constructor(){
    this.mesh = new THREE.Object3D();
    this.mesh.name = "cloud";
    var geom = new THREE.CubeGeometry(20, 20, 20);
    var mat = new THREE.MeshPhongMaterial({
      color: Colors.white,
    });

    var nBlocs = 3 + Math.floor(Math.random() * 3);
    for (var i = 0; i < nBlocs; i++) {
      var m = new THREE.Mesh(geom.clone(), mat);
      m.position.x = i * 15;
      m.position.y = Math.random() * 10;
      m.position.z = Math.random() * 10;
      m.rotation.z = Math.random() * Math.PI * 2;
      m.rotation.y = Math.random() * Math.PI * 2;
      var s = .1 + Math.random() * .9;
      m.scale.set(s, s, s);
      m.castShadow = true;
      m.receiveShadow = true;
      this.mesh.add(m);
    }
  }

  

}

export default class Main {

  constructor() {
    this.restart()
  }

  restart() {

    this.createScene();
    this.createLights();
    this.createPlane();
    this.createEnemyPlane();
    this.createSky();
    this.loop();

  }

  //INIT THREE JS, SCREEN AND MOUSE EVENTS

 createScene() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({ context: ctx, antialias: true})

  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(0xf7d9aa);

  wx.onTouchMove(function(e){
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    var tx = -1 + (x / WIDTH) * 2;
    var ty = 1 - (y / HEIGHT) * 2;
    mousePos = { x: tx, y: ty };
  });
}

 

createLights() {

  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
}



  Sky () {
    this.mesh = new THREE.Object3D();
    this.nClouds = 20;
    this.clouds = [];
    var stepAngle = Math.PI * 2 / this.nClouds;
    for (var i = 0; i < this.nClouds; i++) {
      var c = new Cloud();
      this.clouds.push(c);
      var a = stepAngle * i;
      var h = 2000 - Math.random() * 200;
      c.mesh.position.y = Math.sin(a) * h;
      c.mesh.position.x = Math.cos(a) * h;
      c.mesh.position.z = -400 - Math.random() * 400;
      c.mesh.rotation.z = a + Math.PI / 2;
      var s = 1 + Math.random() * 2;
      c.mesh.scale.set(s, s, s);
      this.mesh.add(c.mesh);
    }
  }

  

  createPlane() {
    airplane = new AirPlane();
    airplane.mesh.scale.set(.25, .25, .25);
    airplane.mesh.position.y = 100;
    scene.add(airplane.mesh);
  }

  createEnemyPlane() {
    enemyplane = new EnemyPlane();
    enemyplane.mesh.scale.set(.25, .25, .25);
    scene.add(enemyplane.mesh);
  }



  createSky() {
  sky = new this.Sky();
  sky.mesh.position.y = -1700;
  scene.add(sky.mesh);
  }

  updatePlane() {
    var targetY = this.normalize(mousePos.y, -.75, .75, 25, 175);
    var targetX = this.normalize(mousePos.x, -.75, .75, -100, 100);
    airplane.mesh.position.y = targetY;
    airplane.mesh.position.x = targetX;
    airplane.propeller.rotation.x += 0.3;

  }

  normalize(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + (pc * dt);
  return tv;
  }

  // 实现帧循环
  loop() {
    this.updatePlane();
    sky.mesh.rotation.z += .005;
    renderer.render(scene, camera);

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }

}
