'use strict';

// Extension namespace.
var ch = ch || {};

let clickedElement;
let cssPathObject;



ch.CTRL_KEYCODE = 17;
ch.Z_KEYCODE = 90;

ch.clearHighlights = function() {
    var els = document.querySelectorAll('.ch-highlight');
    for (var i = 0, l = els.length; i < l; i++) {
        els[i].classList.remove('ch-highlight');
    }
};

ch.hightlight = function(el){
    el.classList.add('ch-highlight')
}

ch.Bar = function(){

    this.boundHandleRequest_ = this.handleRequest_.bind(this);
    this.boundMouseMove_ = this.mouseMove_.bind(this);
    this.boundKeyDown_ = this.keyDown_.bind(this)

    this.isDOM_ = false;
    this.currEl_ = null;

    this.barFrame_ = document.createElement('iframe')
    this.barFrame_.src = chrome.runtime.getURL('bar.html');
    this.barFrame_.id = 'ch-bar';

    this.barFrame_.classList.add('hidden');

    document.addEventListener('keydown', this.boundKeyDown_)
    chrome.runtime.onMessage.addListener(this.boundHandleRequest_);
};

ch.Bar.prototype.hidden_ = function(){
    return this.barFrame_.classList.contains('hidden')
};

//更新query bar
ch.Bar.prototype.updateQueryAndBar_ = function(el){
    ch.clearHighlights();

    cssPathObject = cssPath(el, window.document.querySelectorAll.bind(window.document));
    this.updateBar_()
}

ch.Bar.prototype.updateBar_ = function() {
    chrome.runtime.sendMessage({
        type: 'update',
        cssSelector: cssPathObject.selector
    });
};

ch.Bar.prototype.showBar_ = function(){
    var that = this;
    function impl(){
        that.barFrame_.classList.remove('hidden');
        document.addEventListener('mousemove', that.boundMouseMove_);
    }
    if(!this.inDOM_){
        this.inDOM_ = true;
        document.body.appendChild(this.barFrame_);
    }
    window.setTimeout(impl, 0);
};

ch.Bar.prototype.hideBar_ = function(){
    var that = this;
    function impl(){
        that.barFrame_.classList.add('hidden');
        document.removeEventListener('mousemove', that.boundMouseMove_);
        ch.clearHighlights();
    }
    window.setTimeout(impl, 0)
}

ch.Bar.prototype.toggleBar_ = function(){
    if(this.hidden_()){
        this.showBar_();
    }else {
        this.hideBar_();
    }
}

ch.Bar.prototype.handleRequest_ = function(request, sender, cb){
    if (request.type === 'hideBar') {
        this.hideBar_();
        window.focus();
    }else if (request.type === "toggleBar") {
        this.toggleBar_();
    }else if(request.type ==="getHost"){
        chrome.runtime.sendMessage({
            type:'host',
            name: window.location.host
        })
    }
}

ch.Bar.prototype.mouseMove_ = function(e){
    if (this.currEl_ === e.toElement) {
        return;
    }
    this.currEl_ = e.toElement;
    if (!e.shiftKey && e.ctrlKey) {
        //this.updateQueryAndBar_(this.currEl_);
        return
    }
}

ch.Bar.prototype.keyDown_ =function(e){
    var ctrlKey = e.ctrlKey;
    var shiftKey = e.shiftKey;

    if (e.keyCode === ch.Z_KEYCODE && ctrlKey && shiftKey) {
        this.toggleBar_();
    }

    if(!this.hidden_() && !shiftKey && e.keyCode === ch.CTRL_KEYCODE){
         this.updateQueryAndBar_(this.currEl_);
         ch.hightlight(this.currEl_)
    }
}

if(location.href.indexOf('acid3.acidtests.org') === -1){
    window.chBarInstance = new ch.Bar();
}
