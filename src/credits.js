const {ipcRenderer, shell} = require('electron');

document.getElementById("exitBtn").addEventListener("click", function(event) {
  ipcRenderer.send('hideCredits','message');
});

function openLink(arg) {
  shell.openExternal(arg);
}
