const {
  app,
  BrowserWindow,
  Menu
} = require('electron')
const path = require('path')
const url = require('url')
const iex = require('iexcloud_api_wrapper')
var new_console = new require('console').Console(process.stdout,process.stderr);
new_console.log("RELOAD");

const update_quote = async (stock_id,do_msg) => {
  //new_console.log('Updating ' + stock_id);
  try {
    const quoteData = await iex.quote(stock_id.toLowerCase());
    new_console.log(quoteData.symbol + ": $" + quoteData.latestPrice.toString());
    if (do_msg) {
      document.getElementById("add_msg").innerHTML = stock_id + ": $" + quoteData.latestPrice.toString();
    }
    addStock(stock_id,quoteData.latestPrice);
  } catch (err) {
    console.log(err);
    document.getElementById("add_msg").style.color = "red";
    document.getElementById("add_msg").innerHTML = "Failed to load " + stock_id + ": " + err.name;
  }
}

document.getElementById("add_btn").addEventListener("click", function(event) {

  var stock_id = document.getElementById("add_text").value.toUpperCase();
  document.getElementById("add_text").value = '';

  document.getElementById("add_msg").style.color = "black";
  document.getElementById("add_msg").innerHTML = "Loading... " + stock_id;

  update_quote(stock_id,true);

});

function addStock(stock_id,price) {

  try {
    let stock_elem = document.getElementById(stock_id);
    //new_console.log(stock_elem.childNodes);
    stock_elem.childNodes[3].innerHTML = price.toString();
  } catch(err) {
    new_node = document.createElement("DIV");
    new_node.id = stock_id;
    new_node.className = 'stock';
    new_node.innerHTML = stock_id + '<br>$<span>' + price.toString() + '</span>';
    document.getElementById('main_panel').appendChild(new_node);
  }

}

setInterval(function() {
  new_console.log("Auto update");
  document.querySelectorAll('.stock').forEach(function(elem) {
    update_quote(elem.id,false);
    //new_console.log(elem.id)
  });
  //new_console.log("Auto update done");
} , 5000);
