var io = io();
var canvas,
    objects,
    scene,
    camera,
    renderer,
    stereo,
    controls,
    isMobile;

isMobile = false;
if (/Mobi/.test(navigator.userAgent)) {
    isMobile = true;
}

var wtexture = new THREE.TextureLoader().load("/textures/wood.jpg");
wtexture.wrapS = THREE.RepeatWrapping;
wtexture.wrapT = THREE.RepeatWrapping;
var w_material = new THREE.MeshBasicMaterial( { map: wtexture } );

var sky_texture = new THREE.TextureLoader().load("/textures/sky.png");
sky_texture.wrapS = THREE.RepeatWrapping;
sky_texture.wrapT = THREE.RepeatWrapping;


function setupGamepad(cb) {
    var roomId = document.location.href.substring(document.location.href.lastIndexOf( '/' )+1);

    io.emit('viewerjoin', {room: roomId});

    io.on('gameinput', function(input){
        console.log(input);
        cb(input);
    });
}

function updateCameraPosition(input) {
    var mult = 0.12;
    camera.position.z -= input.x * mult;
    camera.position.x += input.z * mult;
}


function setupScene() {
    
    /* SETUP UTILS */
    canvas = document.getElementById("canvas-container");
    objects = [];
    scene = new THREE.Scene();
    scene.background = sky_texture;
    camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.001, 20000);
    renderer = new THREE.WebGLRenderer();
    stereo = new THREE.StereoEffect(renderer);
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("canvas-container").appendChild( renderer.domElement );


    /* BUILD OBJECTS */
    // Plane, that helps to determinate an intersection position
    var helperPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff}));
    helperPlane.visible = false;
    var box_geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var box_material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( box_geometry, box_material );

    var geometry = new THREE.PlaneGeometry( 100, 100, 100 );
    var texture = new THREE.TextureLoader().load("/textures/cube1.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    var material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
    plane.rotation.x = -Math.PI/2;

    /* SHOW OBJECTS */
    scene.add(helperPlane);
    scene.add(plane);

    // displayObject(cube);

    camera.position.set(0, 5, 0);
}

function setupOrientationControls() {

    window.addEventListener('deviceorientation', setOrientationControls, true);

    if (isMobile) {
        controls = new THREE.DeviceOrientationControls(camera, renderer.domElement);
        controls.connect();
    } else {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
    }
    function setOrientationControls(e){
        if(!e.alpha){
            return;
        }
        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();
        window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
}

function displayObject(object) {
	// display object json

	objects.push(object);
	scene.add(object);  
}

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}

function setupObjects() {

    $.get( "/objects", function( data ) {
        var objects = data.objects;

        for (var i = 0; i < objects.length; i++) {
            var  o = objects[i];
            if (o.type == "BoxGeometry") {
                var box = new THREE.BoxGeometry(o.scale[0]*3, o.scale[1]*3, o.scale[2]*3);
                var object = new THREE.Mesh(box, w_material);
                // object.quaternion.set(1, o.quaternion[0], o.quaternion[1], o.quaternion[2]);
                object.position.set(o.position[0], o.position[2], o.position[1]);
                displayObject(object);
            } else if (o.type == "CylinderGeometry") {
                var box = new THREE.CylinderGeometry(o.scale[1]*2, o.scale[1]*2, o.scale[1]*4, 32);
                var object = new THREE.Mesh(box, w_material);
                object.rotateY(Math.PI/2);
                // object.quaternion.set(1, o.quaternion[0], o.quaternion[1], o.quaternion[2]);
                object.position.set(o.position[0], o.position[2], o.position[1]);
                displayObject(object);
            } else if (o.type == "SphereGeometry") {
                var box = new THREE.SphereGeometry(o.scale[0]*2, 32, 32);
                var object = new THREE.Mesh(box, w_material);
                // object.quaternion.set(1, o.quaternion[0], o.quaternion[1], o.quaternion[2]);
                object.position.set(o.position[0], o.position[2], o.position[1]);
                displayObject(object);
            } /*else {
                var box = new THREE.ConeGeometry(o.scale[0]*2, o.scale[0]*2, o.scale[0]*4, 32);
                var object = new THREE.Mesh(box, w_material);
                object.rotateY(Math.PI/2);
                object.quaternion.set(1, o.quaternion[0], o.quaternion[1], o.quaternion[2]);
                object.position.set(o.position[0], o.position[2], o.position[1]);
                displayObject(object);
            }*/
        }
    });

}


setupScene();
setupObjects();
setupOrientationControls();
setupGamepad(updateCameraPosition);

var render = function () {
    requestAnimationFrame( render );
    if(isMobile){
        controls.update();
        stereo.render(scene, camera);
    } else {
        renderer.render(scene, camera);
    }
};

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    stereo.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize( window.innerWidth, window.innerHeight );
}

render();