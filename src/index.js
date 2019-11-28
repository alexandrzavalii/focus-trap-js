var candidateSelectors = [
  'input',
  'select',
  'textarea',
  'a[href]',
  'button',
  '[tabindex]',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])'
]

function isHidden (node) {
  // offsetParent being null will allow detecting cases where an element is invisible or inside an invisible element,
  // as long as the element does not use position: fixed. For them, their visibility has to be checked directly as well.
  return node.offsetParent === null || getComputedStyle(node).visibility === 'hidden'
}

function getAllTabbingElements (parentElem) {
  var tabbableNodes = parentElem.querySelectorAll(candidateSelectors.join(','))
  var filterNegativeTabIndex = []
  for (var i = 0; i < tabbableNodes.length; i++) {
    var node = tabbableNodes[i]
    if (
      getTabindex(node) > -1 &&
      !node.disabled &&
      !isHidden(node)
    ) {
      filterNegativeTabIndex.push(node)
    }
  }
  return filterNegativeTabIndex
}

function tabTrappingKey (event, parentElem) {
  // check if current event keyCode is tab
  if (event.key !== 'Tab') return

  if (!parentElem) {
    if (process && process.env.NODE_ENV === 'development') {
      console.warn('focus-trap-js: parent element is not defined')
    }
    return
  }
  // check if current element is inside parent element
  if (!parentElem.contains(event.target)) {
    return
  }

  var allTabbingElements = getAllTabbingElements(parentElem)
  var firstFocusableElement = allTabbingElements[0]
  var lastFocusableElement = allTabbingElements[allTabbingElements.length - 1]

  if (event.shiftKey && event.target === firstFocusableElement) {
    lastFocusableElement.focus()
    event.preventDefault()
  } else if (!event.shiftKey && event.target === lastFocusableElement) {
    firstFocusableElement.focus()
    event.preventDefault()
  }
}

function getTabindex (node) {
  var tabindexAttr = parseInt(node.getAttribute('tabindex'), 10)
  if (!isNaN(tabindexAttr)) return tabindexAttr
  // Browsers do not return tabIndex correctly for contentEditable nodes;
  // so if they don't have a tabindex attribute specifically set, assume it's 0.
  if (isContentEditable(node)) return 0
  return node.tabIndex
}

function isContentEditable (node) {
  return node.contentEditable === 'true'
}

module.exports = tabTrappingKey
