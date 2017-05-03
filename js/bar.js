
'use strict';
var Z_KEYCODE = 90;
var TAB_KEYCODE = 8;
var cur_index = 0;
var host_name = "";
var jsonAttrs = {};

var nodeList;
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
    name : {name:"产品名称",value:"div#product-detail-container span.fl.lagerTitle"},
    alias : {name:"产品简称",value:"div#product-detail-container a.toptitle.c-f36e27"},
    min_amount : {name:"最小认购金额(含)(万)",value:""},
    deadline :{name:"期限月",value:""},
    deadline_introduction : {name:"期限说明",value:""},
    update_notification : {name:"更新说明",value:""},
    type :{name:"发行通道",value:""},
    field : {name:"投资领域",value:""},
    start_date : {name:"开始募集时间",value:""}
}
var choices = {0:'集合信托', 1:"集合资管",2:"债权基金",3:"证券基金"}

function innerOptions(){
    var allOptions = '';
    for(var key in choices){
        var inOption = '<option value=' + key + '>' + choices[key] + '</option>'
        allOptions = allOptions + inOption;
    }
    selectEl.innerHTML = allOptions;
}

function innerAttrs(){
    var allInput = ''
    for(var key in jsonattr){
        var inhtml = '<div class="form-group">\
        <label for="inputEmail3" class="col-sm-2 control-label">' + jsonattr[key].name +'</label>\
        <div class="col-sm-10"><input type="text" class="form-control" value=' + jsonattr[key].value + '>\
        </div></div>';
        allInput = allInput + inhtml;
    }
    listEl.innerHTML = allInput;
    inputInit()
}

selectEl.addEventListener('change',function(e){
    getProductAttrs(this.options[this.selectedIndex].text);
})

//初始化页面数据,接受host，并且请求product_type
var handleHost = function(request, sender, cb){
    if(request.host == 'host'){
        host_name = request.hostName;
        chrome.runtime.sendMessage({
            method:'GET',
            action:'xhttp',
            url:'http://mm.geekfinancer.com/api/entities/companies/?limit=3host=' + request.hostName
        },function(responseText){
            getProductAttrs(responseText[0]);
        })
    }
}

function getProductAttrs(product_type){
    var url = 'http://mm.geekfinancer.com/api/entities/companies/';
    //var url = "http://mm.geekfinancer.com/api/parser/selectors/?host=" +　host_name + "&product_type=" + product_type;
    chrome.runtime.sendMessage({
        method:'GET',
        action:'xhttp',
        url:url
    }, function(responseText){
        innerAttrs();
        innerOptions();
    })
}

chrome.runtime.onMessage.addListener(handleHost);

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
    var formInput = jsonattr;
    var i = 0;
    console.log(nodeList);
    for(var key in formInput){
        formInput[key].value = nodeList[i].value
        i ++;
    }

    chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: 'http://mm.geekfinancer.com/api/entities/companies/?limit=3',
        data: formInput
    }, function(responseText) {
        console.log('data send OK!');
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
