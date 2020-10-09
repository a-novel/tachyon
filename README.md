# Tachyon

A light framework for easier and advanced DOM manipulations.

> The following functions require a client DOM environment to run. They are meant
> to work within client frameworks such as React.

- [Keys](#keys)
    - [Sequencer Initialization](#sequencer-initialization)
    - [Register sequences](#register-sequences)
    - [Special methods](#special-methods)
        - [getSequence](#getsequence)
        - [getValidationStatus](#getvalidationstatus)
        - [setDebugMode](#setdebugmode)
    - [Default key combos](#default-key-combos)
- [os](#os)
- [Selection](#selection)
    - [getRange](#getrange)
    - [setRange](#setrange)
    - [Range ignore](#range-ignore)

## Keys

An advanced eventListener to easily watch for complex key combos.

A simple use case is given below.
```jsx
import React from 'react';
import {keys} from '@anovel/tachyon';
import css from './MyComponent.module.css';

class MyComponent extends React.Component {
  state = {combo: false};

  sequencer = new keys.sequencer();

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

A sequencer is a custom class that will record a serie of pressed keys within the DOM
element it listens to. I can take 2 optional parameters.

```javascript
const sequencer = new keys.sequencer(400, false);
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

#### getValidationStatus

Get the progression of a given sequence :

```javascript
// If getSequence() ends with ['a', 'b', 'c'], returns 3
// If getSequence() ends with ['a', 'b'], returns 2
// If getSequence() ends with ['a'], returns 1
// If getSequence() doesn't end with any of the sequence prefixes, returns 0
const progress = sequencer.getValidationStatus(['a', 'b', 'c']);
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

## os

Return information about the client OS.

```javascript
import {os} from '@anovel/tachyon';

const currentOS = os.getOS();

switch(currentOS) {
case os.OS.WINDOWS:

case os.OS.MACOS:

case os.OS.LINUX:

case os.OS.ANDROID:

case os.OS.IOS:

case os.OS.OTHER:

}
```

## Selection

Tools to easily select text inside complex div structures.

### getRange

```javascript
import {selection} from '@anovel/tachyon';

const currentSelection = selection.getRange(element);
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
import {selection} from '@anovel/tachyon';

const currentSelection = selection.setRange(element, 6, 21);
```

Set selection range within an element. The advantages of this method, compared
to default DOM handlers, are:
- easier declaration
- doesn't crash if off limits (will just stop if their is no more characters to select)
- is compatible with element children DOM hierarchy (you don't have to select a direct textNode)

### Range ignore

Both setRange and getRange take an optional array of string DOM selectors. This
array tells our handlers to ignore some elements when computing selection.

For example, applying:

```javascript
selection.setRange(element, 6, 21, ['span']);
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

# License

[Licensed under MIT for A-Novel](https://github.com/a-novel/tachyon/blob/master/LICENSE).