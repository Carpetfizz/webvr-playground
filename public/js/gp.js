let cb = null;
const rAF = window.requestAnimationFrame;

function initgp(c) {
  cb = c;
}

/* https://www.smashingmagazine.com/2015/11/gamepad-api-in-web-games/ */
window.addEventListener("gamepadconnected", function(e) {
  // Gamepad connected
  console.log("Gamepad connected", e.gamepad);
  rAF(gameloop);
});

window.addEventListener("gamepaddisconnected", function(e) {
  // Gamepad disconnected
  console.log("Gamepad disconnected", e.gamepad);
});

const applyDeadzone = function(number, threshold){
   percentage = (Math.abs(number) - threshold) / (1 - threshold);

   if(percentage < 0)
      percentage = 0;

   return percentage * (number > 0 ? 1 : -1);
}

function gameloop() {
  const gamepad = navigator.getGamepads()[0];
  if (gamepad) {
    const joyX = applyDeadzone(gamepad.axes[0], 0.25);
    const joyZ = applyDeadzone(gamepad.axes[1], 0.25);
    cb({x: joyX, z: joyZ});
  }
  rAF(gameloop);
}