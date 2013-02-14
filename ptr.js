/*
 *
 * PullToRefresh
 * Version 0.001
 * License:  MIT
 * SimonWaldherr
 *
 */

var ptr_scrollable_parent = false;

function ptr_init() {
  document.getElementsByTagName('body')[0].className = !!('ontouchstart' in window) ? 
  document.getElementsByTagName('body')[0].className+=' touch' : 
  document.getElementsByTagName('body')[0].className+=' desktop';
  var scrollables = document.getElementsByClassName('scrollable');
  
  for(var i = 0; i<scrollables.length; i++) {
    var ptr_box    = document.createElement('div'),
    ptr_container  = document.createElement('div'),
    ptr_image      = document.createElement('div'),
    ptr_text       = document.createElement('div');
    
    ptr_box.appendChild(ptr_container);
    ptr_container.appendChild(ptr_image);
    ptr_container.appendChild(ptr_text);
    ptr_text.innerHTML = 'Pull to refresh';
    
    ptr_box.className        = 'ptr_box';
    ptr_container.className  = 'ptr_container';
    ptr_image.className      = 'ptr_image';
    ptr_text.className       = 'ptr_text';
    
    scrollables[i].setAttribute('data-scrollinit', 'true');
    scrollables[i].firstElementChild.insertBefore(ptr_box, scrollables[i].firstElementChild.firstChild);
  }
  
  document.addEventListener('touchstart',function(e) {
    var parent  = e.target;
    for(var i = 0; i < 10; i++) {
      if(typeof parent.className !== 'undefined') {
        if(parent.className.match('scrollable')) {
          
          ptr_scrollable_parent = i;
          i = 10;
          
          if(parent.getAttribute('data-scrollinit') == 'true') {
            
          } else {
            var ptr_box    = document.createElement('div'),
            ptr_container  = document.createElement('div'),
            ptr_image      = document.createElement('div'),
            ptr_text       = document.createElement('div');
            
            ptr_box.appendChild(ptr_container);
            ptr_container.appendChild(ptr_image);
            ptr_container.appendChild(ptr_text);
            ptr_text.innerHTML = 'Pull to refresh';
            
            ptr_box.className        = 'ptr_box';
            ptr_container.className  = 'ptr_container';
            ptr_image.className      = 'ptr_image';
            ptr_text.className       = 'ptr_text';
            
            parent.setAttribute('data-scrollinit', 'true');
            
            parent.firstElementChild.insertBefore(ptr_box, parent.firstElementChild.firstChild);
          }
          
          if(parent.scrollTop === 0) {
            parent.scrollTop = 1;
          } else if((parent.scrollTop+parent.offsetHeight) === parent.scrollHeight) {
            parent.scrollTop = parent.scrollTop-1;
          }
        } else {
          parent = parent.parentNode;
        }
      } else {
        parent = parent.parentNode;
      }
    }
  });
  
  document.addEventListener('touchmove',function(e) {
    var parent  = e.target;
    var scroll  = false;
    
    for(var i = 0; i < ptr_scrollable_parent; i++) {
      parent = parent.parentNode;
    }
    
    if((parent.getAttribute('data-scrollinit') == 'true')&&(ptr_scrollable_parent != false)) {
      
      scroll = true;
      
      var ptr_element = parent;
      var ptr_wrapelement = ptr_element.getElementsByClassName('wrap')[0];
      
      var top = ptr_element.scrollTop;
      var ptr = ptr_element.getElementsByClassName('ptr_box')[0];
      
      if(ptr_element.scrollTop < 0) {
        ptr_wrapelement.getElementsByClassName('ptr_image')[0].style.webkitTransform = "rotate("+(top*4)+"deg)";
      }
      if(ptr_element.scrollTop < -41) {
        if(ptr_wrapelement.className.indexOf(' active') === -1) {
          ptr_wrapelement.className += ' active';
          ptr_wrapelement.getElementsByClassName('ptr_text')[0].innerHTML = 'Release to refresh';
        }
      } else if(ptr_element.scrollTop != 0) {
        ptr_wrapelement.className = ptr_wrapelement.className.replace(' active', '');
        ptr_wrapelement.getElementsByClassName('ptr_text')[0].innerHTML = 'Pull to refresh';
      }
    }
    if((typeof parent.parentNode === 'undefined')||(typeof parent.parentNode.className === 'undefined')) {
      
    } else {
      parent = parent.parentNode;
    }
    if(scroll == false) {
      e.preventDefault();
    }
  });
  
  document.addEventListener('touchend',function(e) {
    var parent  = e.target;
    var scroll  = false;
    
    for(var i = 0; i < ptr_scrollable_parent; i++) {
      parent = parent.parentNode;
    }
    
    if(parent.getAttribute('data-scrollinit') == 'true') {
      
      var ptr_element = parent;
      var ptr_wrapelement = ptr_element.getElementsByClassName('wrap')[0];
      var ptr_eleId = parent.id;
      
      var top = ptr_element.scrollTop;
      var ptr = ptr_element.getElementsByClassName('ptr_box')[0];
      
      if(ptr_element.scrollTop < 0) {
        if((ptr_wrapelement.className.indexOf(' active') != -1)) {
          ptr_wrapelement.getElementsByClassName('ptr_image')[0].className += ' loading';
          ptr_wrapelement.getElementsByClassName('ptr_text')[0].innerHTML = 'Loading ...';
          ptr_wrapelement.style.top = '65px';
          ptr_element.scrollTop = 0;
          var time = new Date();
          
          if(parent.getAttribute('data-url') != '') {
            reqwest({
                url: parent.getAttribute('data-url')+'?rt='+time.getTime()
              , type: 'html'
              , method: 'post'
              , error: function (err) { console.log(err); }
              , success: function (resp) {
                  var ptrbox = document.getElementById(ptr_eleId).getElementsByClassName('ptr_box')[0];
                  var insert = document.createElement('div');
                  insert.innerHTML = resp;
                  insert.className = 'inserted';
                  
                  ptr_wrapelement.insertBefore(insert, ptrbox.nextSibling);
                  
                  var inserted = document.getElementsByClassName('inserted')[0];
                  ptr_element.scrollTop = inserted.clientHeight-65;
                  
                  hideLoading(ptr_eleId);
                }
            })
          }
        }
      }
    }
    ptr_scrollable_parent = false;
  });
}

function hideLoading(elementId) {
  var element     = document.getElementById(elementId);
  var wrapelement = element.getElementsByClassName('wrap')[0];
  var className   = element.className;
  
  wrapelement.getElementsByClassName('ptr_image')[0].className = wrapelement.getElementsByClassName('ptr_image')[0].className.replace(' loading', '');
  wrapelement.style.top = '0px';
}