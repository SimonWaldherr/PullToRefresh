/*
 *
 * PullToRefresh
 * Version 0.006
 * License:  MIT
 * SimonWaldherr
 *
 */

/*jslint browser: true*/
/*global reqwest, alert*/

var ptr_scrollable_parent = false;

function ptr_init() {
  "use strict";
  var  ptr_box, ptr_container, ptr_image, ptr_text, i = 0, scrollables = document.getElementsByClassName('ptr_scrollable');
  if ((window.hasOwnProperty('ontouchstart')) || (window.navigator.msPointerEnabled)) {
    document.getElementsByTagName('body')[0].className += ' touch';
  } else {
    document.getElementsByTagName('body')[0].className += ' notouch';
  }

  for (i = 0; i < scrollables.length; i += 1) {
    if (scrollables[i].hasAttribute('data-url') !== false) {
      ptr_box = document.createElement('div');
      ptr_container = document.createElement('div');
      ptr_image = document.createElement('div');
      ptr_text = document.createElement('div');

      ptr_box.appendChild(ptr_container);
      ptr_container.appendChild(ptr_image);
      ptr_container.appendChild(ptr_text);
      ptr_text.innerHTML = 'Pull to refresh';

      ptr_box.className = 'ptr_box';
      ptr_box.style.right = '99%';
      ptr_container.className = 'ptr_container';
      ptr_image.className = 'ptr_image';
      ptr_text.className = 'ptr_text';

      scrollables[i].firstElementChild.insertBefore(ptr_box, scrollables[i].firstElementChild.firstChild);
    }
  }

  document.addEventListener('touchstart', function (e) {
    var ptr_box, ptr_container, ptr_image, ptr_text, parent = e.target, i = 0;

    if (parent.className === undefined) {
      return false;
    }

    for (i = 0; i < 10; i += 1) {
      if (parent.className !== undefined) {

        if (parent.className.match('ptr_scrollable')) {

          ptr_scrollable_parent = i;
          i = 10;

          if (parent.hasAttribute('data-url') !== false) {
            if (parent.getElementsByClassName('ptr_box')[0] === undefined) {
              ptr_box = document.createElement('div');
              ptr_container = document.createElement('div');
              ptr_image = document.createElement('div');
              ptr_text = document.createElement('div');

              ptr_box.appendChild(ptr_container);
              ptr_container.appendChild(ptr_image);
              ptr_container.appendChild(ptr_text);
              ptr_text.innerHTML = 'Pull to refresh';

              ptr_box.className = 'ptr_box';
              ptr_box.style.right = '0px';
              ptr_container.className = 'ptr_container';
              ptr_image.className = 'ptr_image';
              ptr_text.className = 'ptr_text';

              parent.firstElementChild.insertBefore(ptr_box, parent.firstElementChild.firstChild);
            } else {
              parent.getElementsByClassName('ptr_box')[0].style.opacity = 1.0;
              parent.getElementsByClassName('ptr_text')[0].innerHTML = 'Pull to refresh';
            }
          } else if (parent.getElementsByClassName('ptr_box')[0] !== undefined) {
            parent.removeChild(parent.getElementsByClassName('ptr_box')[0]);
          }

          if (parent.scrollTop === 0) {
            parent.scrollTop = 1;
            parent.getElementsByClassName('ptr_wrap')[0].style.top = '1px';
          } else if ((parent.scrollTop + parent.offsetHeight) === parent.scrollHeight) {
            parent.scrollTop = parent.scrollTop - 1;
          }
        }
      }

      if ((parent.parentNode.tagName === undefined)) {
        i = 10;
        return false;
      }
      if ((parent.parentNode.tagName === 'BODY') || (parent.parentNode.tagName === 'HTML')) {
        i = 10;
        return false;
      }

      parent = parent.parentNode;
    }
  });

  document.addEventListener('touchmove', function (e) {
    var parent = e.target, scroll = false, rotate = 90, i = 0, ptr_element, ptr_wrapelement, top, ptr, scrolldistance, ptr_eleId, time, ptrbox, insert, inserted;

    if (ptr_scrollable_parent === false) {
      e.preventDefault();
      return false;
    }

    for (i = 0; i < ptr_scrollable_parent; i += 1) {
      parent = parent.parentNode;
    }

    if ((ptr_scrollable_parent !== false) && (parent.hasAttribute('data-url') !== false)) {

      scroll = true;

      ptr_element = parent;
      ptr_wrapelement = ptr_element.getElementsByClassName('ptr_wrap')[0];
      top = ptr_element.scrollTop;
      ptr_box = ptr_element.getElementsByClassName('ptr_box')[0];
      scrolldistance = Math.abs(ptr_element.scrollTop);

      if ((ptr_wrapelement.className.indexOf(' active') === -1) && (!ptr_wrapelement.getElementsByClassName('ptr_image')[0].className.match('ptr_loading')) && (ptr_element.scrollTop < 1)) {
        if (ptr_element.scrollTop < -25) {
          rotate = (top < -40) ? -90 : 130 + parseInt(top * 12 + 270, 10);
        }

        if (ptr_element.scrollTop < 0) {
          ptr_box.style.right = '0px';
          if (scrolldistance > 55) {
            ptr_box.style.height = '55px';
            ptr_box.style.top = '-55px';
          }

          ptr_wrapelement.getElementsByClassName('ptr_image')[0].style['-webkit-transform'] = 'scale(1) rotate(' + rotate + 'deg)';
        }

        if (ptr_element.scrollTop < -51) {
          if (ptr_wrapelement.className.indexOf(' ptr_active') === -1) {
            ptr_box.style.right = '0px';
            ptr_wrapelement.className += ' ptr_active';
            ptr_wrapelement.getElementsByClassName('ptr_text')[0].innerHTML = 'Loading ...';
            ptr_wrapelement.getElementsByClassName('ptr_image')[0].className += ' ptr_loading';

            if (parent.getAttribute('data-url') === 'reload') {
              window.location.reload(true);
              return false;
            }

            ptr_element = parent;
            ptr_wrapelement = ptr_element.getElementsByClassName('ptr_wrap')[0];
            ptr_eleId = parent.id;
            time = new Date();

            reqwest({
              url: parent.getAttribute('data-url') + '?rt=' + time.getTime(),
              type: 'html',
              method: 'post',
              data: {
                usertime: time.getTime()
              },
              error: function () {
                alert('Could not connect');
                ptr_wrapelement.style.top = '0px';
                ptr_box.getElementsByClassName('ptr_image')[0].className = ptr.getElementsByClassName('ptr_image')[0].className.replace(' loading', '');
                ptr_wrapelement.className = ptr_wrapelement.className.replace(' ptr_active', '');
              },
              success: function (resp) {
                ptrbox = document.getElementById(ptr_eleId).getElementsByClassName('ptr_box')[0];
                insert = document.createElement('div');
                insert.innerHTML = resp;
                insert.className = 'ptr_inserted';

                ptr_wrapelement.insertBefore(insert, ptrbox.nextSibling);
                ptr_wrapelement.style.top = '0px';
                ptr_box.getElementsByClassName('ptr_image')[0].className = ptr_box.getElementsByClassName('ptr_image')[0].className.replace(' ptr_loading', '');
                ptr_wrapelement.className = ptr_wrapelement.className.replace(' ptr_active', '');
                inserted = document.getElementsByClassName('ptr_inserted')[0];
                ptr_element.scrollTop = inserted.clientHeight - 51;
                ptr_wrapelement.getElementsByClassName('ptr_text')[0].innerHTML = '';
                ptr_box.style.right = '99%';

                ptr_wrapelement.getElementsByClassName('ptr_image')[0].className = ptr_wrapelement.getElementsByClassName('ptr_image')[0].className.replace(' ptr_loading', '');

                ptr_scrollable_parent = false;
              }
            });
          }
        } else if (ptr_element.scrollTop !== 0) {
          if (ptr_wrapelement.className.indexOf(' active') !== -1) {
            ptr_wrapelement.className = ptr_wrapelement.className.replace(' ptr_active', '');
            ptr_wrapelement.getElementsByClassName('ptr_text')[0].innerHTML = 'Pull to refresh';
          }
        }
      }
    } else if ((ptr_scrollable_parent !== false)) {
      scroll = true;
    }

    if (scroll === false) {
      e.preventDefault();
    }
  });

  document.addEventListener('touchend', function (e) {
    var parent = e.target, i = 0, ptr_element, ptr_wrapelement, ptr_eleId, top, ptr;

    for (i = 0; i < ptr_scrollable_parent; i += 1) {
      parent = parent.parentNode;
    }

    if ((parent.hasAttribute('data-url') !== false) && (ptr_scrollable_parent !== false)) {
      if ((parent.hasAttribute('data-url') !== false)) {
        ptr_element = parent;
        ptr_wrapelement = ptr_element.getElementsByClassName('ptr_wrap')[0];
        ptr_eleId = parent.id;
        top = ptr_element.scrollTop;
        ptr_box = ptr_element.getElementsByClassName('ptr_box')[0];

        if (ptr_wrapelement.getElementsByClassName('ptr_image')[0].className.match('ptr_loading')) {
          ptr_wrapelement.className = ptr_wrapelement.className.replace(' ptr_active', '');
          ptr_wrapelement.style.top = '51px';
        } else {
          ptr_box.style.right = '99%';
        }
      }
    }

    ptr_scrollable_parent = false;
  });
}
