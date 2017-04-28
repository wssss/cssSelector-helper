
'use strict';
var Z_KEYCODE = 90;
var TAB_KEYCODE = 8;
var cur_index = 0;


var nodeList = document.querySelectorAll('input.form-control');
var tabList = document.querySelectorAll('input.btn');
var submitEl = document.querySelector('button.btn');
var selectEl = document.querySelector('.form-sel');
var listEl = document.querySelector('.input-list');

function clearBoder(){
    var els = document.querySelectorAll('.input-hight');
    for(var i = 0; i < els.length; i++){
        els[i].classList.remove('input-hight');
    }
}

chrome.runtime.sendMessage({
    method: 'GET',
    action: 'xhttp',
    url: 'http://mm.geekfinancer.com/api/entities/companies/?limit=3',
    data: 'q=something'
}, function(responseText) {
    alert(responseText);
    /*Callback function to deal with the response*/
});

Array.prototype.forEach.call(nodeList,function(el,index){
    el.onfocus = (function(index) {
        return function() {
            nodeList[index] = "";
            clearBoder();
            nodeList[index].classList.add('input-hight')
            cur_index = index;
        }
    })(index);
})

Array.prototype.forEach.call(tabList, function(el, index){
    el.onclick = (function(index){
        return function(){
            if(el.classList.contains('btn-primary')) return;
            for(var i = 0; i < tabList.length; i++){
                if(i != index){
                    tabList[i].classList.remove('btn-primary');
                    tabList[i].classList.add('btn-default');
                }else {
                    el.classList.remove('btn-default');
                    el.classList.add('btn-primary');
                }
            }
        }
    })(index)
})

submitEl.onclick = function(){
    nodeList
}

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
        var pre_index = cur_index == 0 ? 0 :cur_index -1;
        nodeList[cur_index].value = request.cssSelector;
        nodeList[cur_index].classList.add('input-hight')
        nodeList[pre_index].classList.remove('input-hight')
        cur_index ++
    }
}

document.addEventListener('keydown', handleKeyDown)

chrome.runtime.onMessage.addListener(handleRequest)
