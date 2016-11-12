const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
let menuOpen = true;

menuToggle.onclick = function() {
  const openClass = "menu menu-open";
  const closeClass = "menu menu-close";
  if(menuOpen) {
    menuOpen = false;
    menu.className = closeClass;
    menuToggle.textContent = "Open";
  } else {
    menuOpen = true;
    menu.className = openClass;
    menuToggle.textContent = "Close";
  }
}