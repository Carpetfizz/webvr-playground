var io = io();
var roomId = document.location.href.substring(document.location.href.lastIndexOf( '/' )+1);

//START BoilerPlate Code for camera rendering
var helper = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff}));
helper.visible = false;

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xadd8e6);
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("canvas-container").appendChild( renderer.domElement );

var box_geometry = new THREE.BoxGeometry( 1, 1, 1 );
var box_material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( box_geometry, box_material );

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

camera.position.z = 10;
camera.position.y = -30;
camera.lookAt(scene.position);
//END Rendering BoilerPlate
io.emit('viewerjoin', {room: roomId});

io.on('gameinput', function(input){
    console.log(input);
		
});

render();
