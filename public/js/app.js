var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("canvas-container").appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );

//For objects
/*
var ObjLoader = new THREE.ObjectLoader();
ObjLoader.load("dinosaur.json", function(obj){
	obj.material.color.setHex( 0xff0000 );
	scene.add( obj );
});
*/
//For JSONS
/*
var JSONLoader = new THREE.JSONLoader();
JSONLoader.load("dinosaur.json", function(geo, mats){
	var obj = new THREE.Mesh( geo, new THREE.MeshBasicMaterial({color: 0xff0000}) );
	scene.add( obj );
});
*/
scene.add( cube );

camera.position.z = 5;

var render = function () {
    requestAnimationFrame( render );

    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;

    renderer.render(scene, camera);
};

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

render();
