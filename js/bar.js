'use strict';

window.onload = function(){
    var bar = bar || {};

    bar.cssSel = "";

    bar.form = function(){
        this.area = document.querySelector('.selector-area');
    }
    
    var handleReq = function(request, sender, cb){
        if(request.type === 'update'){

            if(bar.cssSel == request.cssSelector) return;
            bar.cssSel = request.cssSelector;
  
            form.area.value = request.cssSelector;
        }
    }
    chrome.runtime.onMessage.addListener(handleReq)
    

    var form = new bar.form();
}

