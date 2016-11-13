const canvas = document.getElementById("canvas-container");
const mvspeed = 0.2;
const rotspeed = 0.005;
const sizechange = 0.008;

var raycaster = new THREE.Raycaster();
var objects = [];
var selection = null;
var offset = new THREE.Vector3();
var modify = null;
var moveUp = 0;
var moveY = 0;
var moveX = 0;
var camfront = 0;
var camright = 0;
var camup = 0;
var camrotright = 0;
var sizeUp = false;
var sizeDown = false;
var sender = null;
// Plane, that helps to determinate an intersection position
var helper = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff}));
helper.visible = false;

var sky_texture = new THREE.TextureLoader().load("textures/sky.png");
sky_texture.wrapS = THREE.RepeatWrapping;
sky_texture.wrapT = THREE.RepeatWrapping;

var scene = new THREE.Scene();
scene.background = sky_texture; // new THREE.Color(0xadd8e6);
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("canvas-container").appendChild( renderer.domElement );

var wtexture = new THREE.TextureLoader().load("textures/wood.jpg");
wtexture.wrapS = THREE.RepeatWrapping;
wtexture.wrapT = THREE.RepeatWrapping;
//wtexture.repeat.set(10, 10);
var w_material = new THREE.MeshBasicMaterial( { map: wtexture } );
var green_material = new THREE.MeshBasicMaterial( { color: 0x00ff7f, map: wtexture } );

var create_objects = [
	function() {
		let geometry = new THREE.BoxGeometry(3, 3, 3);
		let obj = new THREE.Mesh(geometry, w_material);
		return obj;
	},

	function() {
		let geometry = new THREE.CylinderGeometry( 2, 2, 4, 32 );
		let obj = new THREE.Mesh(geometry, w_material);
		obj.translateZ(obj.geometry.parameters.height/2);
		obj.rotateX(Math.PI/2);
		return obj;
	},

	function() {
		let geometry = new THREE.SphereGeometry( 2, 32, 32 );
		let obj = new THREE.Mesh(geometry, w_material);
		obj.translateZ(obj.geometry.parameters.radius);
		return obj;
	},

	function() {
		let geometry = new THREE.ConeGeometry( 2, 4, 32 );
		let obj = new THREE.Mesh(geometry, w_material);
		obj.rotateX(Math.PI/2);
		return obj;
	}
];

/*
var box_geometry = new THREE.BoxGeometry( 1, 1, 1 );
var box_material = new THREE.MeshBasicMaterial( { map: wtexture } );
var cube = new THREE.Mesh( box_geometry, box_material );

var box1_geometry = new THREE.BoxGeometry( 2, 1, 1 );
var box1_material = new THREE.MeshBasicMaterial( { map: wtexture} );
var cube1 = new THREE.Mesh( box1_geometry, box1_material );
*/

var geometry = new THREE.PlaneGeometry( 100, 100, 100 );
var texture = new THREE.TextureLoader().load("textures/cube1.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(10, 10);
var material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometry, material );

scene.add(helper);
scene.add(plane);
// displayObject(cube);
// displayObject(cube1);
camera.position.z = 6;
camera.position.y = -15;
camera.lookAt(scene.position);

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.addEventListener( 'change', render );



function displayObjectByID(id) {
	// get object json based on id and calls displayObject
	displayObject(create_objects[id]());
}

function displayObject(object) {
	// display object json
	object.translateZ(object.geometry.parameters.height/2);
	objects.push(object);
	scene.add(object);
}

function removeObjectByID(id) {
	// removeObject(cube);
}

function removeObject(object) {
	objects.splice(objects.indexOf(object), 1);
	scene.remove(object);
}

function initsender(s) {
	sender = s;
}

function sendScene() {

	var smallObjects = [];

	for (var i = 0; i < objects.length; i++) {
		object = objects[i];
		var o = {
			type: object.geometry.type,
			position: [object.position.x, object.position.y, object.position.z],
			quaternion: [object.quaternion.x, object.quaternion.y, object.position.z],
			scale: [object.scale.x, object.scale.y, object.scale.z]
		}
		smallObjects.push(o);
	}

	console.log(smallObjects);

	$.ajax({
	    type: "POST",
	    url: "/save",
	    // The key needs to match your method's input parameter (case-sensitive).
	    data: {objects: smallObjects},
	    dataType: "json"
	});

}

var render = function () {
	if (modify) {
		modify.position.z += moveUp * mvspeed;
		modify.position.y += moveY * mvspeed;
		modify.position.x += moveX * mvspeed;
		modify.scale.x += sizeUp * sizechange;
		modify.scale.y += sizeUp * sizechange;
		modify.scale.z += sizeUp * sizechange;
	}
	camera.position.y += camfront * mvspeed;
	camera.position.x += camright * mvspeed;
	camera.position.z += camup * mvspeed;
	camera.rotateY(-camrotright * rotspeed);
	requestAnimationFrame( render );
    renderer.render(scene, camera);
};

function animate() {
	requestAnimationFrame(animate);
	render();
	update();
}


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}


window.addEventListener( 'dblclick', onWindowDblclick, false );

function onWindowDblclick() {
	clear_modify();
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
	if (intersects.length > 0 && intersects[0]) {
		// Set the modify - first intersected object
		modify = intersects[0].object;
		// Calculate the offset
		// console.log(intersects[0]);
		modify.material = green_material;
	}
}

function clear_modify() {
	if (modify) {
		modify.material = w_material;
		modify = null;
	}
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
	if (intersects.length > 0 && intersects[0]) {
		// Disable the controls
		controls.enabled = false;
		// Set the selection - first intersected object
		selection = intersects[0].object;
		// Calculate the offset
		// console.log(intersects[0]);
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
	if (selection != null) {
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
	controls.enabled = true;
	selection = null;
}

window.addEventListener("keydown",keyDownHandler, false);	
window.addEventListener("keyup",keyUpHandler, false);

function keyDownHandler() {
	controls.enabled = false;
	switch (event.keyCode) {
		case 38:
			moveUp = 1;
			break;
		case 40:
			moveUp = -1;
			break;
		case 90:
			sizeUp = -1;
			break;
		case 88:
			sizeUp = 1;
			break;
		case 87:
			camfront = 1;
			break;
		case 83:
			camfront = -1;
			break;
		case 68:
			camright = 1;
			break;
		case 65:
			camright = -1;
			break;
		case 81:
			camrotright = -1;
			break;
		case 69:
			camrotright = 1;
			break;
		case 79:
			moveY = 1;
			break;
		case 75:
			moveUp = -1;
			break;
		case 76:
			moveX = 1;
			break;
		case 74:
			moveX = -1;
			break;
		case 67:
			camup = 1;
			break;
		case 86:
			camup = -1;
			break;
		case 73:
			moveUp = 1;
			break;
		case 85:
			moveY = -1;
			break;
	}
}

function keyUpHandler() {
	controls.enabled = false;
	switch (event.keyCode) {
		case 38:
			moveUp = 0;
			break;
		case 40:
			moveUp = 0;
			break;
		case 90:
			sizeUp = 0;
			break;
		case 88:
			sizeUp = 0;
			break;
		case 87:
			camfront = 0;
			break;
		case 83:
			camfront = 0;
			break;
		case 68:
			camright = 0;
			break;
		case 65:
			camright = 0;
			break;
		case 81:
			camrotright = 0;
			break;
		case 69:
			camrotright = 0;
			break;
		case 79:
			moveY = 0;
			break;
		case 75:
			moveUp = 0;
			break;
		case 76:
			moveX = 0;
			break;
		case 74:
			moveX = 0;
			break;
		case 67:
			camup = 0;
			break;
		case 86:
			camup = 0;
			break;
		case 73:
			moveUp = 0;
			break;
		case 85:
			moveY = 0;
			break;
	}
}

/*
function zoomout() {
	camera.position.z += 1;
	camera.position.y -= 3;
}

function zoomin() {
	camera.position.z -= 1;
	camera.position.y += 3;
}
*/

render();