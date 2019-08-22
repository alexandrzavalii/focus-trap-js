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

function getAllTabbingElements (parentElem) {
  var tabbableNodes = parentElem.querySelectorAll(candidateSelectors.join(','))
  var filterNegativeTabIndex = []
  for (var i = 0; i < tabbableNodes.length; i++) {
    if (getTabindex(tabbableNodes[i]) > -1) {
      filterNegativeTabIndex.push(tabbableNodes[i])
    }
  }
  return filterNegativeTabIndex
}

function tabTrappingKey (event, parentElem) {
  // check if current event keyCode is tab
  if (event.keyCode !== 9) return

  // check if current element is inside parent element
  if (!parentElem || !parentElem.contains(event.target)) {
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
  // Browsers do not return `tabIndex` correctly for contentEditable nodes;
  // so if they don't have a tabindex attribute specifically set, assume it's 0.
  if (isContentEditable(node)) return 0
  return node.tabIndex
}

function isContentEditable (node) {
  return node.contentEditable === 'true'
}

module.exports = tabTrappingKey
