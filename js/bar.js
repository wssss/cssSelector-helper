
'use strict';
var Z_KEYCODE = 90;
var TAB_KEYCODE = 8;
var cur_index = 0;


var nodeList;
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

var jsonattr = {
    name : "产品名称",
    alias : "产品简称",
    min_amount : "最小认购金额(含)(万)",
    deadline : "期限(月)",
    deadline_introduction : "期限说明",
    update_notification : "更新说明",
    type : "发行通道",
    field : "投资领域",
    start_date : "开始募集时间"
}

var handleHost = function(request, sender, cb){
    if(request.host == 'host'){
        chrome.runtime.sendMessage({
            method:'GET',
            action:'xhttp',
            url:'http://mm.geekfinancer.com/api/entities/companies/?limit=3host=' + request.hostName
        },function(responseText){
            innerAttrs();
            console.log('success');
        })
    }
}

chrome.runtime.onMessage.addListener(handleHost)

// function getAttrs(){
//     chrome.runtime.sendMessage({
//         method: 'GET',
//         action: 'xhttp',
//         url: 'http://mm.geekfinancer.com/api/entities/companies/?limit=3',
//         data: 'q=something'
//     }, function(responseText) {
//         /*Callback function to deal with the response*/
//
//     });
// }
// getAttrs()

function innerAttrs(){
    var allInput = ''
    for(var key in jsonattr){
        var inhtml = '<div class="form-group">\
        <label for="inputEmail3" class="col-sm-2 control-label">' + jsonattr[key] +'</label>\
        <div class="col-sm-10"><input type="text" class="form-control">\
        </div></div>';
        allInput = allInput + inhtml;
    }
    listEl.innerHTML = allInput;
    inputInit()
}

function inputInit(){
    var nodeList = document.querySelectorAll('input.form-control');

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

    chrome.runtime.onMessage.addListener(handleRequest)
}

submitEl.onclick = function(){
    chrome.runtime.sendMessage({
        method: 'GET',
        action: 'xhttp',
        url: 'http://mm.geekfinancer.com/api/entities/companies/?limit=3',
        data: 'q=something'
    }, function(responseText) {
        /*Callback function to deal with the response*/
        innerAttrs();
        console.log('success');
    });
}

var handleKeyDown = function(e){
    var ctrlKey = e.ctrlKey || e.metaKey;
    var shiftKey = e.shiftKey;

    if(e.keyCode === Z_KEYCODE && ctrlKey && shiftKey){
        chrome.runtime.sendMessage({type:"hideBar"})
    }
}

document.addEventListener('keydown', handleKeyDown);

chrome.runtime.sendMessage({type:'getHost'});
