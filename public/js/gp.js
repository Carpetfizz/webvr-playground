/* http://luser.github.io/gamepadtest/ */
const haveEvents = 'GamepadEvent' in window;
const controllers = {};
const rAF = window.requestAnimationFrame;

const buttonMap = ["A","B","X","Y","LB","RB","LT","RT","BACK","START","J1","J2","UP","DOWN","LEFT","RIGHT"];
const axesMap = ["LX","LY","RX","RY"];
let cb = null;


function initgp(c) {
  cb = c; 
}

function connecthandler(e) {
  addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad; var d = document.createElement("div");
  rAF(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}

function updateStatus() {
  scangamepads();
  for (j in controllers) {
    var controller = controllers[j];

    for (var i=0; i<controller.buttons.length; i++) {
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        val = val.value;
      }
      if(pressed) {
        cb({"type": "button", "name": buttonMap[i], "val": val});
      }
    }

    for (var i=0; i<controller.axes.length; i++) {
        const axesVal = controller.axes[1].toFixed(3);
        cb({"type": "axes", "name": axesMap[i], "val": axesVal});
    }
  }
  rAF(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in controllers)) {
        addgamepad(gamepads[i]);
      } else {
        controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}