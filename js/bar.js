
'use strict';
var Z_KEYCODE = 90;
var TAB_KEYCODE = 8;
var cur_index = 0;

// var els = document.getElementsByClassName('form-control');
// for(var i = 0; i < els.length; i++){
//     els[i].onfocus = function(e){
//         console.log(e);
//     }
// }

var nodeList = document.querySelectorAll('.form-control');

Array.prototype.forEach.call(nodeList,function(el,index){
    el.onfocus = (function(index) {
        return function() {
            nodeList[index] = ""
            cur_index = index;
        }
    })(index);
})

var handleKeyDown = function(e){
    var ctrlKey = e.ctrlKey || e.metaKey;
    var shiftKey = e.shiftKey;

    if(e.keyCode === Z_KEYCODE && ctrlKey && shiftKey){
        chrome.runtime.sendMessage({type:"hideBar"})
    }
}

var handleRequest = function(request, sender, cb){
    if(cur_index >= nodeList.length) return;
    if(request.type === 'update'){
        nodeList[cur_index].value = request.cssSelector;
        cur_index ++
    }
}

document.addEventListener('keydown', handleKeyDown)

chrome.runtime.onMessage.addListener(handleRequest)
