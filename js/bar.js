
'use strict';
var Z_KEYCODE = 90;
var TAB_KEYCODE = 8;
var cur_index = 0;


var ajax = function(data){
    //data={data:"",datatype:"xml/json",type:"get/post",url:"",asyn:"true/false",success:function(){},failure:function(){}}
    var xhr = new XMLHttpRequest;

    var type = data.type ==='get' ? 'get' : 'post';
    var url = '';
    var flag = data.asyn == 'true' ? 'true' :'false';

    xhr.open(type, url, flag);
    if(type == 'get'){
        xhr.send(null);
    }else if (type=='opst') {
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send(data.data)
    }

    xhr.onreadystatechange = function(){
        if(this.readyState == 4){
            if(this.status === 200){
                if(typeof data.success == 'function'){
                    var data = data.dataType == 'xml' ? xhr.responseXML : xhr.responseText;
                    data.success(d);
                }else {
                    if(typeof data.failure == 'function'){
                        data.failure();
                    }
                }
            }
        }
    }
}

var nodeList = document.querySelectorAll('input.form-control');
var tabList = document.querySelectorAll('input.btn');
var submitEl = document.querySelector('button.btn')

function clearBoder(){
    var els = document.querySelectorAll('.input-hight');
    for(var i = 0; i < els.length; i++){
        els[i].classList.remove('input-hight');
    }
}

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
