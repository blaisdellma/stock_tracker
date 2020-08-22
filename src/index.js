const fs = require('fs')
const fetch = require('node-fetch');

var console_out = new require('console').Console(process.stdout, process.stderr);

const token = JSON.parse(fs.readFileSync('iex_test_cred.json')).api_token;
console_out.log("Using " + token + " as API token");

//const base_url = "https://sandbox.iexapis.com/stable/stock/market/batch?token=" + token + "&types=quote&filter=symbol,latestPrice&symbols=";
const base_url = "https://sandbox.iexapis.com/stable/stock/market/batch?token=" + token + "&types=quote&symbols=";

var stockList = ["GOOG", "AAPL", "VTI", "PPL", "DOW", "TSLA"];

var side_out = false;
var side_stock_id = "";

var reply_data = {};

function getURL() {
  return base_url + stockList.join(",");
}

function clearMsg() {
  document.getElementById("msg").style.color = "black";
  document.getElementById("msg").innerHTML = "";
}

function sendMsg(str) {
  document.getElementById("msg").style.color = "black";
  document.getElementById("msg").innerHTML = str;
}

function sendErr(str) {
  document.getElementById("msg").style.color = "red";
  document.getElementById("msg").innerHTML = str;
}

document.getElementById("add_btn").addEventListener("click", function(event) {
  addBtnClick();
});

document.getElementById("add_text").addEventListener("keydown", function(event) {
  if (event.keyCode == 13) {
    addBtnClick();
  }
});

document.getElementById("update_btn").addEventListener("click", function(event) {
  updateStocks();
});

document.getElementById("side_btn").addEventListener("click", function(event) {
  if (side_out) {
    side_slide_in();
  } else {
    side_slide_out("");
  }
});

function side_slide_in() {
  document.getElementById("side_panel_contents").style.width = "0px";
  document.getElementById("side_svg").style.transform = "scaleX(1)";
  side_out = false;
}

function side_slide_out(stock_id) {
  document.getElementById("side_panel_contents").style.width = "100px";
  document.getElementById("side_svg").style.transform = "scaleX(-1)";
  side_out = true;

  side_stock_id = stock_id;
}

function update_side() {
  document.getElementById("side_title").innerHTML = side_stock_id;
  //document.getElementById("side_value").innerHTML = "$" + document.getElementById(stock_id + "_value").innerHTML;
  document.getElementById("side_value").innerHTML = "$" + reply_data[side_stock_id].quote.latestPrice;
  //document.getElementById("side_details").innerHTML = JSON.stringify(reply_data[stock_id].quote);

  change_img = "";

  if (reply_data[side_stock_id].quote.change > 0) {
    change_img = "<img id=change_arrow_svg src=../assets/images/004-up-arrow-8.svg><br>"
  } else if (reply_data[side_stock_id].quote.change < 0) {
    change_img = "<img id=change_arrow_svg src=../assets/images/062-down-arrow-8.svg><br>"
  }

  document.getElementById("side_details").innerHTML = change_img + reply_data[side_stock_id].quote.change;
}

function addBtnClick() {

  var stock_id = document.getElementById("add_text").value.toUpperCase();
  document.getElementById("add_text").value = '';

  if (stock_id != "") {
    stockList.push(stock_id);
    stockList = stockList.reduce((unique, item) => {
      return unique.includes(item) ? unique : [...unique, item];
    }, []);
    updateStocks();
  }

}

function createDeleteBtn() {
  var new_node = document.createElement("DIV");
  new_node.className = 'deleteBtn';
  //new_node.onclick =
  new_node.addEventListener('click', function(event) {
    stockList.splice(stockList.indexOf(new_node.parentNode.id),1);
    console_out.log("Deleting: " + new_node.parentNode.id + " -> " + stockList);
    new_node.parentNode.parentNode.removeChild(new_node.parentNode);
    event.stopPropagation();
  }, true);
  new_node.innerHTML = '<img class="small_icon" src="../assets/images/020-close.svg">';
  return new_node;
}

function updateStocks() {
  clearMsg();

  if (stockList.length == 0) return;

  var iexURL = getURL(stockList);
  var settings = {
    method: "Get"
  };
  console_out.log("\nSending request: " + iexURL);

  fetch(iexURL, settings).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw res.statusText;
    }
  }, error => {
    console_out.log("\nERROR:\n" + error);
    sendErr("ERROR");
  }).then(json => {
      document.getElementById('main_panel').innerHTML = '';
      stockList = [];
      console_out.log("\nReply:")
      console_out.log(json);

      reply_data = json;

      for (let [stock_id, value] of Object.entries(json)) {
        stockList.push(stock_id);
        new_node = document.createElement("DIV");
        new_node.id = stock_id;
        new_node.className = 'stock';
        new_node.innerHTML = stock_id + '<br>$<span id=' + stock_id + '_value' + '>' + value.quote.latestPrice + '</span>';
        new_node.appendChild(createDeleteBtn());
        new_node.addEventListener('click', function(event) {
          console_out.log("CLICK ON " + stock_id);
          side_slide_out(stock_id);
          update_side();
        },false);
        document.getElementById('main_panel').appendChild(new_node);
      }

      console_out.log("Stock list: " + stockList);

  }, (error) => {
    console_out.log(error);
    sendErr("ERROR: " + error);
    if (error == "Not Found") {
      stockList.pop();
    }
  });

}

//updateStocks();
