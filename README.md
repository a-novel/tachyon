# Tachyon

A light framework for easier and advanced DOM manipulations.

> The following functions require a client DOM environment to run. They are meant
> to work within client frameworks such as React.

## Keys

An advanced eventListener to easily watch for complex key combos.

A simple use case is given below.
```jsx
import React from 'react';
import {keys} from '@anovel/tachyon';
import css from './MyComponent.module.css';

class MyComponent {
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
| sequence | string[] | The sequence of key to trigger the callback. |
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

# License

Licensed under MIT for A-Novel.