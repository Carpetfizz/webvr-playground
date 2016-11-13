var io = io();
var roomId = document.location.href.substring(document.location.href.lastIndexOf( '/' )+1);

io.emit('viewerjoin', {room: roomId});

io.on('gameinput', function(input){
    console.log(input);
		
});


const canvas = document.getElementById("canvas-container");
var raycaster = new THREE.Raycaster();
var objects = [];
var selection = null;
var offset = new THREE.Vector3();
// Plane, that helps to determinate an intersection position
var helper = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff}));
helper.visible = false;


var scene = new THREE.Scene();
scene.background = new THREE.Color(0xadd8e6);
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("canvas-container").appendChild( renderer.domElement );

var box_geometry = new THREE.BoxGeometry( 1, 1, 1 );
var box_material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( box_geometry, box_material );

var box1_geometry = new THREE.BoxGeometry( 2, 1, 1 );
var box1_material = new THREE.MeshBasicMaterial( { color: 0x01fde0 } );
var cube1 = new THREE.Mesh( box1_geometry, box1_material );

var geometry = new THREE.PlaneGeometry( 100, 100, 100 );
var texture = new THREE.TextureLoader().load("/textures/cube1.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(10, 10);
var material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometry, material );

scene.add(helper);
scene.add(plane);
displayObject(cube);
displayObject(cube1);
camera.position.z = 10;
camera.position.y = -30;
camera.lookAt(scene.position);

function displayObject(object) {
	// display object json
	objects.push(object);
	scene.add(object);
	object.translateZ(object.scale.z/2);
    object.translateY(-20);
}

var render = function () {
	requestAnimationFrame( render );
    renderer.render(scene, camera);
};

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}


render();