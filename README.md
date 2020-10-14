# Tachyon

<div align="center">
    <a href="https://www.npmjs.com/package/@anovel/tachyon">
        <img alt="npm (scoped)" src="https://img.shields.io/npm/v/@anovel/tachyon?style=for-the-badge">
    </a>
    <a href="https://github.com/a-novel/tachyon/blob/master/LICENSE">    
        <img alt="GitHub" src="https://img.shields.io/github/license/a-novel/tachyon?style=for-the-badge">
    </a>
</div>

<div align="center">
    <a href="https://codecov.io/gh/a-novel/tachyon">
        <img alt="Codecov" src="https://img.shields.io/codecov/c/github/a-novel/tachyon?style=flat-square">
    </a>
    <img alt="David" src="https://img.shields.io/david/dev/a-novel/tachyon?style=flat-square">
    <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/min/@anovel/tachyon?style=flat-square">
</div>
<br/>

A light framework for easier and advanced DOM manipulations.

> The following functions require a client DOM environment to run. They are meant
> to work within client frameworks such as React.

- [Keys](#keys)
    - [Sequencer Initialization](#sequencer-initialization)
    - [Register sequences](#register-sequences)
    - [Special methods](#special-methods)
        - [getSequence](#getsequence)
        - [getValidationProgress](#getvalidationprogress)
        - [setDebugMode](#setdebugmode)
    - [Default key combos](#default-key-combos)
- [Os](#os)
- [Selection](#selection)
    - [getRange](#getrange)
    - [setRange](#setrange)
    - [Range ignore](#range-ignore)
- [Url](#url)
    - [goTo](#goto)
    - [isActive](#isactive)
- [License](#license)

## Keys

An advanced eventListener to easily watch for complex key combos.

A simple use case is given below.

```jsx
import React from 'react';
import {Sequencer} from '@anovel/tachyon';
import css from './MyComponent.module.css';

class MyComponent extends React.Component {
  state = {combo: false};

  sequencer = new Sequencer();

  ref = React.createRef();

  validateCombo = () => {
    this.setState({combo: true});
  };

  componentDidMount() {
    this.sequencer.listen(this.ref.current);
    this.sequencer.register(['a', 'b', 'c'], this.validateCombo);
  }

  render() {
    return(
      <div ref={this.ref} className={this.state.combo ? css.pressed : ''}>Press a, b and c</div>
    );
  }
}
```

### Sequencer Initialization

A Sequencer is a custom class that will record a list of pressed keys within the DOM
element it is attached to. I can take 2 optional parameters.

```javascript
const sequencer = new Sequencer(400, false);
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| Speed | number | The maximum time, in milliseconds, between 2 key press to validate the combo. |
| Debug | boolean | Debug mode will print information about current sequences and actions in the web console. |

Once your sequencer is initialized, you need to attach it an element to listen to.

```javascript
// element is a DOM element.
sequencer.listen(element);
```

> Not adding any element or putting `null` value will attach the listener to the whole
> document.

### Register sequences

Now your sequencer is active, you have to attach listeners, in a similar fashion the
default `.addEventListener` works.

```javascript
sequencer.register(sequence, callback, fallback);
```

> register will fail if `sequencer.listen()` was not called before.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| sequence | string[] | The sequence of key to trigger the callback. Keys are referring to the event attribute `e.key`. |
| callback | function: InputEvent | The callback to execute when sequence is validated. |
| fallback | function: InputEvent | An optional function to run each time a key is pressed but the combo is not validated. |

### Special methods

#### getSequence

Returns the latest recorded sequence of keys.

```javascript
const currentSequence = sequencer.getSequence();
```

#### getValidationProgress

Get the progression of a given sequence :

```javascript
// If getSequence() ends with ['a', 'b', 'c'], returns 3
// If getSequence() ends with ['a', 'b'], returns 2
// If getSequence() ends with ['a'], returns 1
// If getSequence() doesn't end with any of the sequence prefixes, returns 0
const progress = sequencer.getValidationProgress(['a', 'b', 'c']);
```

#### setDebugMode

Set debug mode to true or false dynamically.

```javascript
// Activate debug mode if not.
sequencer.setDebugMode(true);
```

### Default key combos

Keys provides some default keys sequences to use within your listeners. You can use
them via `keys.COMBOS`.

| Combo Name | Keys |
| :--- | :--- |
| UNDO | Ctrl+z (Cmd+z for macOS) |
| REDO | Ctrl+Alt+z (Cmd+Alt+z for macOS) |
| SELECTALL | Ctrl+a (Cmd+a for macOS) |
| COPY | Ctrl+c (Cmd+c for macOS) |
| CUT | Ctrl+x (Cmd+x for macOS) |
| PASTE | Ctrl+v (Cmd+v for macOS) |
| KONAMI_CODE | up up down down left right left right b a |

## Os

Return information about the client OS.

```javascript
import {getOS, literals} from '@anovel/tachyon';

const currentOS = getOS();

switch(currentOS) {
case literals.OS.WINDOWS:

case literals.OS.MACOS:

case literals.OS.LINUX:

case literals.OS.ANDROID:

case literals.OS.IOS:

case literals.OS.OTHER:

}
```

## Selection

Tools to easily select text inside complex div structures.

### getRange

```javascript
import {getRange} from '@anovel/tachyon';

const currentSelection = getRange(element);
```

Returns the current caret range within a given element. The returned
object is consisting of 3 keys :

```json
{
  "absolute": {
    "start": 0,
    "end": 10,
  },
  "start": {
    "container": "someDiv",
    "offset": 0
  },
  "end": {
    "container": "someDiv",
    "offset": 4
  }
}
```

Start and End are provided by the default selection handlers. DOM cannot
handle selection outside a textNode. Given the following HTML structure:

```html
<div>Lorem ipsum dolor <span>sit amet</span>, consectetur adipiscing elit.</div>
```

Now let's imagine an end user selected characters from offset 6 to 21:

```html
ipsum dolor <span>sit
```

If you run `window.getSelection().getRangeAt(0)`, you'll get a result
similar to this one :

```json
{
  "startContainer": "YourDiv",
  "endContainer": "YourSpan",
  "startOffset": 6,
  "endOffset": 3,
}
```

This is because your selection starts in the container `<div>` at offset 6,
and ends in the `<span>` at offset 3. Those are the information returned within
`start` and `end` keys.

Now, for better convenience and readability, we'd like to know that offset 3
in `<span>` is equivalent to the offset 21 in `<div>`, so we know in our text,
independently from DOM partition, the caret goes from character 6 to 21.

This is the goal of the returned `absolute` key. Absolute position will ignore
the DOM partitioning within our parent element to return the actual positions
of the caret bounds, as they appear to human eyes.

### setRange

```javascript
import {setRange} from '@anovel/tachyon';

// Returns {start: 6, end: 21} if both bounds are in limits,
// {start: x, end: y} if one or both limit was overflowing or
// {start: -1, end: -1} if content is empty.
const currentSelection = setRange(element, 6, 21);
```

Set selection range within an element. The advantages of this method, compared
to default DOM handlers, are:
- easier declaration
- doesn't crash if off limits (will just stop if their is no more characters to select)
- is compatible with element children DOM hierarchy (you don't have to select a direct textNode)

`setRange` returns an object with the actual absolute bounds that were set (which may differ
from parameters if one or both were off limits).

### Range ignore

Both setRange and getRange take an optional array of string DOM selectors. This
array tells our handlers to ignore some elements when computing selection.

For example, applying:

```javascript
setRange(element, 6, 21, ['span']);
```

to:

```html
<div>Lorem ipsum dolor <span>sit amet</span>, consectetur adipiscing elit.</div>
```

will select:

```html
ipsum dolor <span>sit amet</span>, c
```

since it will not count what is between spans (although it will select it since
selection cannot be cut half).

# Url

## goTo

Navigate to the page passed as parameter.

```javascript
import {goTo} from '@anovel/tachyon';
import {history} from 'path/to/history/handler';

// Navigates to the url '/foo/bar'
goTo('/foo/bar', {history});
```

You can pass optional configuration arguments:

```javascript
import {goTo} from '@anovel/tachyon';
import {history} from 'path/to/history/handler';

// Navigates to the url '/foo/bar' in another tab.
goTo('/foo/bar', {history, openOutside: true});
```

| Option | Type | Description |
| :--- | :--- | :--- |
| urlParams | object | Populates the url with given parameters.<br/>`goTo('/:foo', {urlParams: {foo: 'bar'}}) -> opens /bar` |
| urlQuery | object | Generates query string.<br/>`goTo('/home', {urlQuery: {foo: 'bar'}}) -> opens /home?foo=bar` |
| openOutside | boolean | Opens url in a new window. |
| skip | boolean | Replace last history entry. |
| history | object | React history handler. |

## isActive

Check if the current url matches a route.

```javascript
import {isActive} from '@anovel/tachyon';

const active = isActive('/hello/world');
// /hello/world     -> true
// /hello/world/42  -> true
// /hello           -> false
```

You can pass an optional configuration argument:

| Option | Type | Description |
| :--- | :--- | :--- |
| exact | boolean | Only returns if both url matches exactly (ignoring queryParams). |
| location | object | Custom location object with pathname and other location data. It uses `window.location` by default. |

# License

[Licensed under MIT for A-Novel](https://github.com/a-novel/tachyon/blob/master/LICENSE).