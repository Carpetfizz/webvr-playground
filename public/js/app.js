var io = io();

initgp(input);

io.emit('editorjoin', {room: roomId});

function input(i) {
    io.emit('sendinput', {input: i});
}

const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const zmin = document.getElementById("zoomin");
const zmout = document.getElementById("zoomout");
let menuOpen = true;


function showObjectByID(i) {
  displayObjectByID(i);
};

// zmin.onclick = zoomin;
// zmout.onclick = zoomout;

menuToggle.onclick = function() {
  const openClass = "menu menu-open";
  const closeClass = "menu menu-close";
  if(menuOpen) {
    menuOpen = false;
    menu.className = closeClass;
    menuToggle.textContent = ">>";
  } else {
    menuOpen = true;
    menu.className = openClass;
    menuToggle.textContent = "<<";
  }
}