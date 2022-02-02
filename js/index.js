var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(0, 0, 3);
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x142D47, 2);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var radius = 1;

var Distortion = function(){
	
	this.mesh = new THREE.Object3D();
	this.mesh.name = "distortion";

	var geomDist = new THREE.ConeBufferGeometry(0.02, 0.02, 0.02);
	var matDist = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: false});
	var dist = new THREE.Mesh(geomDist, matDist);
	dist.position.set(0,0,0);
    dist.rotation.x = -Math.PI * 0.5;
	dist.castShadow = true;
	dist.receiveShadow = true;
	this.mesh.add(dist);
}

var Tabs = function(){

	this.mesh = new THREE.Object3D();
	this.mesh.name = "tabs";

	var geomTa = new THREE.ConeGeometry(0.04,0.3,0.050);
	var matTa = new THREE.ShaderMaterial({
  uniforms: {
    color1: {
      value: new THREE.Color(0xd0d0d0)
    },
    color2: {
      value: new THREE.Color(0x0D414E)
    },
    bboxMin: {
      value: sphgeom.boundingBox.min
    },
    bboxMax: {
      value: sphgeom.boundingBox.max
    }
  },
  vertexShader: `
    uniform vec3 bboxMin;
    uniform vec3 bboxMax;
  
    varying vec2 vUv;

    void main() {
      vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
  
    varying vec2 vUv;
    
    void main() {
      
      gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
    }
  `,
  wireframe: false
});
	var ta = new THREE.Mesh(geomTa, matTa);
	ta.position.set(0,0,0);
	ta.rotation.x = -Math.PI * 0.5;
	ta.castShadow = true;
	ta.receiveShadow = true;
	this.mesh.add(ta);
}

var sphgeom = new THREE.SphereGeometry(radius, 32, 24);
sphgeom.computeBoundingBox();
var sphmat = new THREE.ShaderMaterial({
  uniforms: {
    color1: {
      value: new THREE.Color(0xA6070C)
    },
    color2: {
      value: new THREE.Color(0x0D414E)
    },
    bboxMin: {
      value: sphgeom.boundingBox.min
    },
    bboxMax: {
      value: sphgeom.boundingBox.max
    }
  },
  vertexShader: `
    uniform vec3 bboxMin;
    uniform vec3 bboxMax;
  
    varying vec2 vUv;

    void main() {
      vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
  
    varying vec2 vUv;
    
    void main() {
      
      gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
    }
  `,
  wireframe: false
});
var sphere = new THREE.Mesh(sphgeom, sphmat);
scene.add(sphere);

var params1 = {
    modelcolor1: "#A6070C"
};
var params2 = {
    modelcolor2: "#0D414E"
};

var gui = new dat.GUI();
var folder = gui.addFolder('Kolory wirusa');
folder.addColor(params1, 'modelcolor1')
    .name('Kolor pierwszy')
    .onChange(function(){
    sphmat.uniforms.color1.value.set(params1.modelcolor1);
});
folder.addColor(params2, 'modelcolor2')
    .name('Kolor drugi')
    .onChange(function(){
    sphmat.uniforms.color2.value.set(params2.modelcolor2);
});

function createDistortion(){
	dist=[]
	for (var i = 0; i < 1500; i++){
		dist[i]=new Distortion();
        let dx = Math.random() * Math.PI * 2;
		let dy = Math.random() * Math.PI;
		dist[i].mesh.position.setFromSphericalCoords(1 + 0.010, dy, dx);
		dist[i].mesh.lookAt(sphere.position);
        sphere.add(dist[i].mesh);
	}
}

function createTabs(){
	tabs=[]
	for (var i = 0; i < 300; i++){
		tabs[i]=new Tabs();
        let rx= Math.random() * Math.PI * 2;
		let ry=Math.random() * Math.PI;
		tabs[i].mesh.position.setFromSphericalCoords(1 + 0.010, ry, rx);
		tabs[i].mesh.lookAt(sphere.position);
        sphere.add(tabs[i].mesh);
	}
}

var singledist;
singledist= new Distortion()
scene.add(singledist.mesh)

var singletabs;
singletabs= new Tabs()
scene.add(singletabs.mesh)

createDistortion();
createTabs();

folder.open();

render();
function render(){
    sphere.rotation.y += 0.01;
    sphere.rotation.x += 0.01;
    sphere.rotation.z += 0.01;    

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}