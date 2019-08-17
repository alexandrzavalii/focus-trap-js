var candidateSelectors = [
  'input',
  'select',
  'textarea',
  'a[href]',
  'button',
  '[tabindex]',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
];

const getAllTabbingElements = (parentElem) => {
  const tabbableNodes = parentElem.querySelectorAll(candidateSelectors.join(','));
  const filterNegativeTabIndex = [];
  for (let i = 0; i < tabbableNodes.length; i++) {
    if(getTabindex(tabbableNodes[i]) > -1){
      filterNegativeTabIndex.push(tabbableNodes[i]);
    }
  }
  return filterNegativeTabIndex;
};

const findNextTabbableElement = (parentElem, element) => {
  let findNode = null;
  let findNextTabbableNode = null;
  if (!parentElem || !element) {
    return null;
  }
  const recursiveSearch = (rootNode, elm) => {
    for (let i = 0; i < rootNode.childNodes.length; i++) {
      const child = rootNode.childNodes[i];
      if (findNode && child.nodeType === 1 && child.getAttribute('tabIndex') === 0) {
        findNextTabbableNode = child;
        return findNextTabbableNode;
      }


      if (child === elm) {
        findNode = child;
      }
      recursiveSearch(child, element);
    }
    return null;
  };

  recursiveSearch(parentElem, element);
  return findNextTabbableNode;
};

 const tabTrappingKey = (event, parentElem) => {
     // check if current element is inside parent element
  if(!parentElem.contains(event.target)) {
         return;
  }

  if(event.keyCode !== 9) return;

    const allTabbingElements = getAllTabbingElements(parentElem);
    console.log("allTabbingElements",allTabbingElements);
    const firstFocusableElement = allTabbingElements[0];
    const lastFocusableElement = allTabbingElements[allTabbingElements.length - 1];

    if (event.shiftKey &&
      (event.target === firstFocusableElement)) {
      if (lastFocusableElement) {
        lastFocusableElement.focus();
        event.preventDefault();
        return;
      }
    } else if (!event.shiftKey && event.target === lastFocusableElement) {
      if (firstFocusableElement) {
        firstFocusableElement.focus();
        event.preventDefault();
        return;
      }
    }

    if (!event.shiftKey && event.target.tabIndex !== 0) {
      // find next tabIndexable element instead
      const nextTabableElement = findNextTabbableElement(parentElem, event.target) || firstFocusableElement;

      if(nextTabableElement) {
        nextTabableElement.focus();
        event.preventDefault();
      }
  }
};


function getTabindex(node) {
  var tabindexAttr = parseInt(node.getAttribute('tabindex'), 10);
  if (!isNaN(tabindexAttr)) return tabindexAttr;
  // Browsers do not return `tabIndex` correctly for contentEditable nodes;
  // so if they don't have a tabindex attribute specifically set, assume it's 0.
  if (isContentEditable(node)) return 0;
  return node.tabIndex;
}

function isContentEditable(node) {
  return node.contentEditable === 'true';
}

module.exports = tabTrappingKey;
  