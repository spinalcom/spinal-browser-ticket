function clamp(number, lower, upper) {
  if (Math.clamp) { return Math.clamp(number, lower, upper); }
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

function perCent(nb, div) {
  return (nb / div) * 100;
}

function getElemtCenter(elem) {
  return {
    x: elem.offsetLeft + (elem.clientWidth / 2),
    y: elem.offsetTop + (elem.clientHeight / 2)
  };
}

export default function createDragElement(elmnt, headerElem) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0,
    offsetTop, offsetLeft;
  if (headerElem) {
    // if present, the header is where you move the DIV from:
    headerElem.onmousedown = dragMouseDown;
    headerElem.addEventListener("touchstart", toucheDown, true);
    headerElem.addEventListener("touchmove", touchElementDrag, false);

  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
    elmnt.addEventListener("touchstart", toucheDown, true);
    elmnt.addEventListener("touchmove", touchElementDrag, false);
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    offsetTop = elmnt.offsetTop;
    offsetLeft = elmnt.offsetLeft;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;

  }
  function toucheDown(e) {
    var touch = e.targetTouches[0];
    pos3 = touch.pageX;
    pos4 = touch.pageY;
    offsetTop = elmnt.offsetTop;
    offsetLeft = elmnt.offsetLeft;
  }

  function touchElementDrag(e) {
    var touch = e.targetTouches[0];
    pos1 = pos3 - touch.pageX;
    pos2 = pos4 - touch.pageY;
    drag();
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    drag();
  }
  function drag() {
    // set the element's new position:
    let centerElem = getElemtCenter(elmnt);
    if ((elmnt.parentElement.clientWidth / 2) < centerElem.x) {
      elmnt.style.left = "auto";
      const right = (elmnt.parentElement.clientWidth - offsetLeft + pos1 - elmnt.clientWidth);
      elmnt.style.right =
        clamp(
          perCent(right, elmnt.parentElement.clientWidth),
          perCent(8, elmnt.parentElement.clientWidth),
          perCent(elmnt.parentElement.clientWidth - elmnt.clientWidth - 8, elmnt.parentElement.clientWidth),
        ) + "%";
    } else {
      elmnt.style.right = "auto";
      elmnt.style.left =
        clamp(
          perCent(offsetLeft - pos1, elmnt.parentElement.clientWidth),
          perCent(8, elmnt.parentElement.clientWidth),
          perCent(elmnt.parentElement.clientWidth - elmnt.clientWidth - 8, elmnt.parentElement.clientWidth)
        ) + "%";
    }
    if ((elmnt.parentElement.clientHeight / 2) < centerElem.y) {
      elmnt.style.top = "auto";
      const right = (elmnt.parentElement.clientHeight - offsetTop + pos2 - elmnt.clientHeight);
      elmnt.style.bottom =
        clamp(
          perCent(right, elmnt.parentElement.clientHeight),
          perCent(8, elmnt.parentElement.clientHeight),
          perCent(elmnt.parentElement.clientHeight - elmnt.clientHeight - 8, elmnt.parentElement.clientHeight),
        ) + "%";
    } else {
      elmnt.style.bottom = "auto";
      elmnt.style.top =
        clamp(
          perCent(offsetTop - pos2, elmnt.parentElement.clientHeight),
          perCent(8, elmnt.parentElement.clientHeight),
          perCent(elmnt.parentElement.clientHeight - elmnt.clientHeight - 8, elmnt.parentElement.clientHeight)
        ) + "%";
    }

  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
