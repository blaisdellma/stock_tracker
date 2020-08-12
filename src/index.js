const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')

document.getElementById("add_btn").addEventListener("click", function(event) {
  document.getElementById("add_msg").style.color = "black";
  document.getElementById("add_msg").innerHTML = "Loading... " + document.getElementById("add_text").value;


  document.getElementById("add_msg").style.color = "red";
  document.getElementById("add_msg").innerHTML = "Failed to load " + document.getElementById("add_text").value;
});
