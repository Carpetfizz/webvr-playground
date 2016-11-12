const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
let menuOpen = true;

let inventorylst = [
  {name: "Apple", id: "apple"},
  {name: "Banana", id: "apple"},
  {name: "Cat", id: "apple"},
  {name: "Denny", id: "apple"},
  {name: "Egg", id: "apple"},
  {name: "Fruit", id: "apple"}
];

for (let inv of inventorylst) {
  let btn = document.createElement("BUTTON");
  let text = document.createTextNode(inv.name);
  btn.appendChild(text);
  // btn.onclick = displayObject(inv.object);
  btn.className = "init_button";
  menu.appendChild(btn);
}


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