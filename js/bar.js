'use strict';

var Z_KEYCODE = 90;
var TAB_KEYCODE = 8;
var cur_index = 0;
var host_name = "";
var responseObj = {}
var resList = [];
var domain = "http://127.0.0.1:8000/"

var nodeList = []
var submitEl = document.querySelector('button.btn');
var selectEl = document.querySelector('.form-sel');
var listEl = document.querySelector('.input-list');


function clearBoder(){
    var els = document.querySelectorAll('.input-hight');
    for(var i = 0; i < els.length; i++){
        els[i].classList.remove('input-hight');
    }
}

function innerOptions(choices){
    var allOptions = '';
    for(var i = 0; i < choices.length; i++){
        var inOption = '<option value=' + choices[i] + '>' + choices[i] + '</option>'
        allOptions = allOptions + inOption;
    }
    selectEl.innerHTML = allOptions;
}

function innerAttrs(list){
    var allInput = ''
    for(var i = 0; i < list.length; i ++){
        var inhtml = '<div class="form-group">\
        <label for="inputEmail3" class="col-sm-2 control-label">' + list[i].verbose_name +'</label>\
        <div class="col-sm-10"><input type="text" class="form-control" value=' + list[i].selector + '>\
        </div></div>';
        allInput = allInput + inhtml;
    }
    listEl.innerHTML = allInput;
    inputInit()
}

selectEl.addEventListener('change',function(e){
    cur_index = 0;
    getProductAttrs(this.options[this.selectedIndex].text);
})

//初始化页面数据,接受host，并且请求product_type

function getProductAttrs(product_type){
    var url = domain + "admin/api/parser/product-selectors/" +　host_name + "/?product_type=" + encodeURI(product_type);
    chrome.runtime.sendMessage({
        method:'GET',
        action:'xhttp',
        url:url
    }, function(responseText){
        var response = JSON.parse(responseText)
        resList = response.results;
        innerAttrs(response.results);
    })
}

var handleReq = function(request, sender, cb){
    if(request.type === 'update'){
        if(cur_index >= nodeList.length) return;
        var pre_index = cur_index == 0 ? 0 :cur_index -1;
        nodeList[cur_index].value = request.cssSelector;
        nodeList[cur_index].classList.add('input-hight')
        nodeList[pre_index].classList.remove('input-hight')
        cur_index ++
        return true;
    }else if(request.type == 'host'){
        host_name = request.name.replace('www.','');
        chrome.runtime.sendMessage({
            method:'GET',
            action:'xhttp',
            url:domain + 'admin/api/parser/product-selectors/' + host_name + '/'
        },function(responseText){
            responseObj = JSON.parse(responseText)
            innerOptions(responseObj.value);
            getProductAttrs(responseObj.value[0]);
        })
        return true
    }
}
chrome.runtime.onMessage.addListener(handleReq)

function inputInit(){
    nodeList = document.querySelectorAll('input.form-control');

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
}

//提交
submitEl.onclick = function(){
    var formInput = resList;
    for(var i = 0;i < formInput.length; i ++){
        formInput[i].selector = nodeList[i].value
    }
    var data = JSON.stringify({results:formInput})
    var url = domain + "admin/api/parser/product-selectors/" +　host_name + "/batch/";
    chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: url,
        data: data
    }, function(responseText) {
        alert('提交成功！')
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

//host 地址只能在content.js获取，获取后并发送到bar.js。
chrome.runtime.sendMessage({type:'getHost'});
