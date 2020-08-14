const {
  app,
  BrowserWindow,
  Menu
} = require('electron')
const fs = require('fs')
const path = require('path')
const url = require('url')
const iex = require('iexcloud_api_wrapper')

const fetch = require('node-fetch');

const base_url1 = "https://sandbox.iexapis.com/stable/stock/market/batch?token=";
const base_url2 = "&types=quote&filter=symbol,latestPrice&symbols=";

var new_console = new require('console').Console(process.stdout, process.stderr);
new_console.log("RELOAD");

var token = JSON.parse(fs.readFileSync('iex_test_cred.json')).api_token;
new_console.log(token);

var stockList = ["GOOG", "AAPL", "VTI", "PPL", "DOW", "TSLA"];
var priceList = [0, 0, 0, 0, 0, 0];

function getURL() {
  return base_url1 + token + base_url2 + stockList.join(",");
}

function clearMsg() {
  document.getElementById("add_msg").style.color = "black";
  document.getElementById("add_msg").innerHTML = "";
}

function sendMsg(str) {
  document.getElementById("add_msg").style.color = "black";
  document.getElementById("add_msg").innerHTML = str;
}

function sendErr(str) {
  document.getElementById("add_msg").style.color = "red";
  document.getElementById("add_msg").innerHTML = str;
}

document.getElementById("add_btn").addEventListener("click", function(event) {
  addBtnClick();
});

document.getElementById("update_btn").addEventListener("click", function(event) {
  updateStocks();
});

document.getElementById("add_text").addEventListener("keydown", function(event) {
  if (event.keyCode == 13) {
    addBtnClick();
  }
});

function addBtnClick() {

  var stock_id = document.getElementById("add_text").value.toUpperCase();
  document.getElementById("add_text").value = '';

  if (stock_id != "") {
    //update_quote(stock_id, true);
    stockList.push(stock_id);
    stockList = stockList.reduce((unique, item) => {
      return unique.includes(item) ? unique : [...unique, item];
    }, []);
    //fetchPrices();
    updateStocks();
  }

}

// async function fetchPrices() {
//   var iexURL = getURL(stockList);
//   new_console.log(iexURL);
//   await fetch(iexURL, {
//     method: "Get"
//   }).then(res => res.json()).then((json) => {
//     new_console.log(json);
//     stockList.forEach((stock_id, i) => {
//       priceList[i] = json[stock_id].quote.latestPrice;
//     });
//   });
//   new_console.log(priceList);
// }

function updateStocks() {
  clearMsg();

  if (stockList.length == 0) return;

  var iexURL = getURL(stockList);
  var settings = {
    method: "Get"
  };
  new_console.log(iexURL);

  fetch(iexURL, settings).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw res.statusText;
    }
  }, error => {
    new_console.log(error);
    sendErr("ERROR");
  }).then(json => {
      document.getElementById('main_panel').innerHTML = '';
      stockList = [];
      new_console.log(json);
      for (let [stock_id, value] of Object.entries(json)) {
        //priceList[i] = json[stock_id].quote.latestPrice;
        stockList.push(stock_id);
        new_node = document.createElement("DIV");
        new_node.id = stock_id;
        new_node.className = 'stock';
        new_node.innerHTML = stock_id + '<br>$<span>' + value.quote.latestPrice + '</span>';
        document.getElementById('main_panel').appendChild(new_node);
      }

      new_console.log(stockList);

  }, (error) => {
    new_console.log(error);
    sendErr("ERROR: " + error);
    if (error == "Not Found") {
      stockList.pop();
    }
  });

}

updateStocks();
