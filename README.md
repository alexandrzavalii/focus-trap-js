# focus-trap-js

Trap focus inside specified HTML element. Vanilla JS with size <0.5kb. No dependencies.

Browser Support: IE 10, Firefox, Chrome.

## Note

No event listeners, it is just handling the current event, and traps the focus if it is neccessary.

## Instalation

```js
npm i focus-trap-js
```

## Usage

```js
import focusTrap from "focus-trap-js";

const popupContainer = document.getElementById("popupId");

document.addEventListener("keydown", event => {
  focusTrap(event, popupContainer);
});
```

The method `focusTrap` accepts two parameters, the `event` and `HTML element` container in which you want to trap your focus.

## Usage in React

```js
import React from "react";
import focusTrap from "focus-trap-js";

const Container = () => {
  const contRef = React.useRef();

  React.useEffect(() => {
    const handleKeyEvent = event => {
      focusTrap(event, contRef.current);
    };
    document.addEventListener("keydown", handleKeyEvent);
    return () => {
      document.removeEventListener("keydown", handleKeyEvent);
    };
  }, [contRef]);

  return <div ref={contRef}></div>;
};
```

## List of Tabbable Elements

```js
const tabbableQuery = [
  "input",
  "select",
  "textarea",
  "a[href]",
  "button",
  "[tabindex]", //tabIndex > 0
  "audio[controls]",
  "video[controls]",
  '[contenteditable]:not([contenteditable="false"])'
];
```
