// ==UserScript==
// @name         Sim Companies $/hour
// @namespace    jonducrou
// @version      0.2
// @description  Shows the Profit/Hour as prices are adjusted.
// @author       jonducrou
// @match        https://www.simcompanies.com/b/*
// @grant        none
// @updateURL    https://github.com/jonducrou/turbo-rotary-phone/raw/main/simcompanies/profit-per-hour.user.js
// ==/UserScript==


// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

window.doIt = function (e) {
    //console.log(this);
    //divT is the div that includes the stock/profit per unit/ fonishes text.
    var divT = jQ(this).parent().parent().parent().parent().parent().prev().find('.col-xs-6')[1];
//    console.log(divT);
    if (divT.innerHTML.includes("Finishes")) {
        if (jQ(divT).find("div.jon").length == 0) {
            jQ(divT).append("<div class=jon/>");
        }
        var divJ = jQ(divT).find("div.jon")[0];
        if (jQ(divT).find("div.max").length == 0) {
            jQ(divT).append("<div class=max/>");
        }
        var divMax = jQ(divT).find("div.max")[0];
        if (jQ(divT).find("div.cost").length == 0) {
            jQ(divT).append("<div class=cost/>");
        }
        var divCost = jQ(divT).find("div.cost")[0];
        var finishText = divT.innerHTML.match(/\(.*?\)/)[0];

        var totalTime = 0;
        if (finishText.includes("h")){
            var h = finishText.substring(1, finishText.indexOf("h"))
            totalTime += Number(h);
        }
        if (finishText.includes("m")){
            var m;
            if (finishText.includes("h")){
                m = finishText.substring(finishText.indexOf("h")+2, finishText.indexOf("m"))
            } else {
                m = finishText.substring(1, finishText.indexOf("m"))
            }
            totalTime += Number(m)/60;
        }
        var profit = divT.children[3].innerHTML.substring(divT.children[3].innerHTML.indexOf("$")+1,divT.children[3].innerHTML.indexOf(" ",divT.children[3].innerHTML.indexOf("$")+1))
        //console.log(profit);
        var quantity = jQ(this).parent().parent().parent().find("input[name='quantity']").val();
       // console.log(quantity);
        var pph = Math.round(100* profit * (quantity/totalTime),2)/100;
        divJ.innerHTML = "$" +  pph + "/h";
        if (divMax.innerHTML < pph) {
            divMax.innerHTML = pph
            divCost.innerHTML = "Best @ $" + jQ(this).parent().parent().parent().find("input[name='price']").val()
        }
    }
}
;

// the guts of this userscript
function main() {
  // Note, jQ replaces $ to avoid conflicts.
//  alert("There are " + jQ('a').length + " links on this page.");
    jQ(document).on("input", 'input[name="price"]', window.doIt);
    jQ(document).on("click", 'i.fa-chevron-up', window.doIt);
    jQ(document).on("click", 'i.fa-chevron-down', window.doIt);

}

// load jQuery and execute the main function
addJQuery(main);
