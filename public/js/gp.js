/* http://luser.github.io/gamepadtest/ */
const haveEvents = 'GamepadEvent' in window;
const controllers = {};
const rAF = window.requestAnimationFrame;
const maxAxesVal = 1.0;

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


var lastInput = [];
var hasChanged = [false, null];
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
      if(buttonMap[i] != hasChanged[1] && pressed){
        hasChanged[0] = true;
        hasChanged[1] = buttonMap[i];
      }
      if(hasChanged[0] && pressed) {
        cb({"type": "button", "name": buttonMap[i], "val": val});
        hasChanged[0] = false;
      }
    }

    if(controller.axes.length == 4){
      if(lastInput.length == 0){
        lastInput = controller.axes;
      } else if (!lastInput.every((elem, index) => elem == controller.axes[index])){
        for (var i=0; i<controller.axes.length; i++) {

            const axesVal = controller.axes[1].toFixed(3);

            cb({"type": "axes", "name": axesMap[i], "val": axesVal});
        }
        lastInput = controller.axes;
      }
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