const tabTrappingKey = require('../src')

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
    get () { return this.parentNode }
  })
})

describe('Null checks', () => {
  test('No parameters passed', () => {
    expect(tabTrappingKey()).toBeFalsy()
  })

  test('Key event without element', () => {
    const event = {
      key: 'Tab'
    }
    process.env.NODE_ENV = 'development'
    global.console.warn = jest.fn()
    expect(tabTrappingKey(event, '')).toBeFalsy()
    expect(console.warn).toBeCalled()
  })

  test('Current element is not inside parent element', () => {
    const mockElement = document.createElement('button')
    const event = {
      key: 'Tab',
      target: mockElement
    }
    const parentElem = {
      contains: (el) => [].includes(el)
    }

    expect(tabTrappingKey(event, parentElem)).toBeFalsy()
  })
})

const createContainer = () => {
  return document.createElement('div')
}

const createButton = (cont) => {
  const newButton = document.createElement('button')
  newButton.focus = jest.fn()
  cont.appendChild(newButton)
  return newButton
}

const createEvent = (target) => {
  return {
    key: 'Tab',
    target: target,
    preventDefault: jest.fn()
  }
}

describe('Functionality Check with buttons', () => {
  let event
  const container = createContainer()
  const firstButton = createButton(container)

  beforeEach(() => {
    event = createEvent(firstButton)
  })

  afterEach(jest.clearAllMocks)
  test('One button inside parent', () => {
    expect(tabTrappingKey(event, container)).toBeTruthy()
    expect(event.preventDefault).toBeCalledTimes(1)
    expect(firstButton.focus).toBeCalledTimes(1)
  })
  test('Two buttons, focus on first and then focus on last', () => {
    const secondButton = createButton(container)

    expect(tabTrappingKey(event, container)).toBeFalsy()
    expect(event.preventDefault).toBeCalledTimes(0)
    expect(secondButton.focus).toBeCalledTimes(0)
    expect(firstButton.focus).toBeCalledTimes(0)
    event.target = secondButton
    expect(tabTrappingKey(event, container)).toBeTruthy()
    expect(event.preventDefault).toBeCalledTimes(1)
    expect(firstButton.focus).toBeCalledTimes(1)
  })
  test('Two buttons, shift focus', () => {
    const secondButton = createButton(container)
    event.shiftKey = true
    event.target = firstButton
    expect(tabTrappingKey(event, container)).toBeTruthy()
    expect(event.preventDefault).toBeCalledTimes(1)
    expect(secondButton.focus).toBeCalledTimes(1)
    expect(firstButton.focus).toBeCalledTimes(0)
    event.target = secondButton
    expect(tabTrappingKey(event, container)).toBeFalsy()
    expect(event.preventDefault).toBeCalledTimes(1)
    expect(firstButton.focus).toBeCalledTimes(0)
  })
})

const createTabbableDiv = (cont) => {
  const el = document.createElement('div')
  el.focus = jest.fn()
  el.setAttribute('tabIndex', 0)
  cont.appendChild(el)
  return el
}
const createNonTabbableDiv = (cont) => {
  const el = document.createElement('div')
  el.focus = jest.fn()
  cont.appendChild(el)
  return el
}
describe('Test elements with custom tabIndex', () => {
  const container = createContainer()
  const div = createTabbableDiv(container)
  let event
  beforeEach(() => {
    event = createEvent(div)
  })
  test('One tabbable div inside container', () => {
    expect(tabTrappingKey(event, container)).toBeTruthy()
    expect(event.preventDefault).toBeCalledTimes(1)
  })
  test('Two tabbable div, one is contentEditable', () => {
    const secondDiv = createNonTabbableDiv(container)
    secondDiv.setAttribute('contentEditable', true)
    expect(tabTrappingKey(event, container)).toBeFalsy()
    expect(event.preventDefault).toBeCalledTimes(0)
    event.target = secondDiv
    expect(tabTrappingKey(event, container)).toBeTruthy()
    expect(event.preventDefault).toBeCalledTimes(1)
  })
})

describe('Test isRadio', () => {
  test('a DIV', () => {
    const node = {
      tagName: 'DIV'
    }
    expect(tabTrappingKey.isNotRadioOrTabbableRadio(node)).toBeTruthy()
  })
  test('Input', () => {
    const node = {
      tagName: 'INPUT'
    }
    expect(tabTrappingKey.isNotRadioOrTabbableRadio(node)).toBeTruthy()
  })
  test('non tabbable radio ', () => {
    const node = document.createElement('input')
    node.type = 'radio'
    expect(tabTrappingKey.isNotRadioOrTabbableRadio(node)).toBeTruthy()
  })

  test('tabbable radio ', () => {
    const ownerDocument = {
      querySelectorAll: jest.fn(() => [node])
    }
    const node = {
      type: 'radio',
      tagName: 'INPUT',
      name: 'name',
      checked: true,
      ownerDocument
    }

    expect(tabTrappingKey.isNotRadioOrTabbableRadio(node)).toBeTruthy()
    expect(ownerDocument.querySelectorAll).toBeCalledWith('input[type="radio"][name="' + node.name + '"]')
  })
})
