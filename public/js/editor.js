const canvas = document.getElementById("canvas-container");
var raycaster = new THREE.Raycaster();
var objects = [];
var seletion = null;
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
var texture = new THREE.TextureLoader().load("textures/cube1.jpg");
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

// controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.addEventListener( 'change', render );



function displayObjectById(id) {
	// get object json based on id and calls displayObject
	
}

function displayObject(object) {
	// display object json
	objects.push(object);
	scene.add(object);
	object.translateZ(object.scale.z/2);
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


window.addEventListener( 'dblclick', onWindowDblclick, false );

function onWindowDblclick() {
	camera.position.z -= 1;
}


canvas.addEventListener('mousedown', this.onDocumentMouseDown, false);
canvas.addEventListener('mousemove', this.onDocumentMouseMove, false);
canvas.addEventListener('mouseup', this.onDocumentMouseUp, false);

function onDocumentMouseDown(event) {
	// Get mouse position
	var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
	var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
	// Get 3D vector from 3D mouse position using 'unproject' function
	var vector = new THREE.Vector3(mouseX, mouseY, 1);
	vector.unproject(camera);
	// Set the raycaster position
	raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
	// Find all intersected objects
	var intersects = raycaster.intersectObjects(objects);
	if (intersects.length > 0) {
		// Disable the controls
		// controls.enabled = false;
		// Set the selection - first intersected object
		selection = intersects[0].object;
		// Calculate the offset
		var intersects = raycaster.intersectObject(helper);
		offset.copy(intersects[0].point).sub(helper.position);
	}
}

function onDocumentMouseMove(event) {
	event.preventDefault();
	// Get mouse position
	var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
	var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
	// Get 3D vector from 3D mouse position using 'unproject' function
	var vector = new THREE.Vector3(mouseX, mouseY, 1);
	vector.unproject(camera);
	// Set the raycaster position
	raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
	if (selection) {
		// Check the position where the plane is intersected
		var intersects = raycaster.intersectObject(plane);
		// Reposition the object based on the intersection point with the plane
		let tmp = selection.position.z;
		selection.position.copy(intersects[0].point.sub(offset));
		selection.translateZ(tmp);
	} else {
		// Update position of the plane if need
		var intersects = raycaster.intersectObjects(objects);
		if (intersects.length > 0) {
			helper.position.copy(intersects[0].object.position);
			helper.lookAt(camera.position);
		}
	}
}

function onDocumentMouseUp(event) {
	// Enable the controls
	// controls.enabled = true;
	selection = null;
}

render();