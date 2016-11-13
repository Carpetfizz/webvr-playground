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
    camera.position.x += input.x * mult;
    camera.position.y -= input.z * mult;
}


function setupScene() {
    
    canvas = document.getElementById("canvas-container");
    objects = [];
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xadd8e6);
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
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

    /* SHOW OBJECTS */
    scene.add(helperPlane);
    scene.add(plane);

    displayObject(cube);

    camera.position.z = 10;
    camera.position.y = -30;
    camera.lookAt(scene.position);
}

function setupOrientationControls() {

    window.addEventListener('deviceorientation', setOrientationControls, true);
    controls = new THREE.DeviceOrientationControls(camera, renderer.domElement);
    controls.connect();
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

function setupRenderer() {
    
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
}

function displayObject(object) {
	// display object json
	objects.push(object);
	scene.add(object);
	object.translateZ(object.scale.z/2);
    object.translateY(-20);
}

setupScene();
setupOrientationControls();
setupRenderer();
setupGamepad(updateCameraPosition);