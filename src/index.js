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

function findNextTabbableElement (parentElem, element) {
  var findNode = null
  var findNextTabbableNode = null
  if (!parentElem || !element) {
    return null
  }
  function recursiveSearch (rootNode, elm) {
    for (var i = 0; i < rootNode.childNodes.length; i++) {
      var child = rootNode.childNodes[i]
      if (
        findNode &&
        child.nodeType === 1 &&
        child.getAttribute('tabIndex') === 0
      ) {
        findNextTabbableNode = child
        return findNextTabbableNode
      }

      if (child === elm) {
        findNode = child
      }
      recursiveSearch(child, element)
    }
    return null
  }

  recursiveSearch(parentElem, element)
  return findNextTabbableNode
}

function tabTrappingKey (event, parentElem) {
  // check if current element is inside parent element
  if (!parentElem.contains(event.target)) {
    return
  }

  if (event.keyCode !== 9) return

  var allTabbingElements = getAllTabbingElements(parentElem)
  var firstFocusableElement = allTabbingElements[0]
  var lastFocusableElement = allTabbingElements[allTabbingElements.length - 1]

  if (event.shiftKey && event.target === firstFocusableElement) {
    if (lastFocusableElement) {
      lastFocusableElement.focus()
      event.preventDefault()
      return
    }
  } else if (!event.shiftKey && event.target === lastFocusableElement) {
    if (firstFocusableElement) {
      firstFocusableElement.focus()
      event.preventDefault()
      return
    }
  }

  if (!event.shiftKey && event.target.tabIndex !== 0) {
    // find next tabIndexable element instead
    var nextTabableElement =
      findNextTabbableElement(parentElem, event.target) || firstFocusableElement

    if (nextTabableElement) {
      nextTabableElement.focus()
      event.preventDefault()
    }
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
