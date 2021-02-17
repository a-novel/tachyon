# Tachyon

Helpers to be used within a frontend framework.

```
yarn add @anovel/tachyon
```

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

- [OS](#os)
- [Url](#url)
  - [goTo](#goto)
  - [isActive](#isactive)
  - [buildUrl](#buildurl)
- [Keys](#keys)
  - [Sequencer.update](#sequencerupdate)
  - [Sequencer.remove](#sequencerremove)
  - [Sequencer.clear](#sequencerclear)
  - [Sequencer.keys](#sequencerkeys)

# OS

Get the current running OS.

```js
import {getOS, literals} from '@anovel/tachyon';

const myOS = getOS();

if (myOS === literals.OS.MACOS) {
	// Do something.
}
```

`getOS` may return any of the following strings (all can be found in `literals.OS`):

| Key     | Value       |
| :---    | :---        |
| WINDOWS | `'Windows'` |
| LINUX   | `'Linux'`   |
| MACOS   | `'macOS'`   |
| IOS     | `'iOS'`     |
| ANDROID | `'Android'` |
| OTHER   | `'unknown'` |

# Url

## goTo

Extra implementation of url navigator with options.

```jsx
import {goTo} from '@anovel/tachyon';

// Basic example
goTo('/foo/bar', history) // opens '/foo/bar' in current tab

// With flags
goTo('/foo/bar', history, {openOutside: true}) // opens '/foo/bar' in a new browser tab
goTo('/foo/bar', history, {skip: true}) // opens '/foo/bar' in current tab, and remove previous location from history

// Using url build options
goTo('/foo/:param', history, {params: {param: 'bar'}}) // opens '/foo/bar'
goTo('/foo/bar', history, {query: {uid: 'user_id'}}) // opens '/foo/bar?uid=user_id'
goTo('/foo/bar', history, {anchor: 'section2'}) // opens '/foo/bar#section2'
```

**Arguments**

| Argument    | Type    | Required | Description                                |
| :---        | :---    | :---     | :---                                       |
| destination | string  | **true** | The url to open.                           |
| history     | History | **true** | The history manager. **[1](#goto-args-1)** |
| options     | Object  | -        | Options (see below table).                 |

<span id="goto-args-1"><b>(1)</b></span> You can read more about routers at [this link](https://reactrouter.com/web/api/history).

**Options**

Additional parameters are available to perform your navigation.

| Key         | Type                    | Description                                                                                                                                         |
| :---        | :---                    | :---                                                                                                                                                |
| params      | Object.<string, string> | A map of <string, string>. Each key/value pair corresponds to an url parameter and the value to interpolate it with.                                |
| query       | Object.<string, any>    | A map that represents query parameters. Query parameters are appended to the url after the `?` character.                                           |
| anchor      | string                  | Load url to a specific anchor.                                                                                                                      |
| openOutside | boolean                 | If true, open the url in a new browser tab.                                                                                                         |
| skip        | boolean                 | If true, replace the current entry in history with the new url. Hitting return from there will go back to previous page instead of the current one. |

## isActive

Check if the current route is active.

```jsx
import {isActive} from '@anovel/tachyon';

// Retrieve your current location from the most convenient way
// (window.location or the react-router location property).
let location;

// The following examples will assume that current location 
// pathname is '/foo/bar/qux'.

console.log(isActive('/foo/bar', location)); // true
console.log(isActive('/foo/qux', location)); // false
console.log(isActive('/foo/bar', location, true)); // false

// You can also check multiple routes at once by passing an array as first argument.
console.log(isActive(['/foo/qux', '/foo/bar'], location)); // true
```

> Trailing slashes are ignored, so `/foo/bar` and `/foo/bar/` will be treated the same, weather in target or 
> currentLocation. Also, if leading slash is missing, it will be added automatically.

**Arguments**

| Argument        | Type                | Required | Description                                                                                |
| :---            | :---                | :---     | :---                                                                                       |
| target          | string<br/>[]string | **true** | The target route(s) to verify. Returns true if the current location matches any of them.   |
| currentLocation | string              | **true** | The current location. A valid location is any Object with a non empty pathname string key. |
| exact           | boolean             | -        | Only match if current location correspond exactly to a target.                             |

## buildUrl

Build an url from a template string and parameters.

```jsx
import {buildUrl} from '@anovel/tachyon';

buildUrl('/foo'); // '/foo'
buildUrl('/foo/:param1', {param1: 'bar'}); // '/foo/bar'
buildUrl('/foo/:param1', {param1: 'bar'}, {uid: 'user_uid'}); // '/foo/bar?uid=user_id'
buildUrl('/search', null, {genre: 'books', priceMax: 10}); // '/search?genre=books&priceMax=10'
```

**Arguments**

| Argument | Type                    | Required | Description                                                                                                          |
| :---     | :---                    | :---     | :---                                                                                                                 |
| url      | string                  | **true** | The url template string.                                                                                             |
| params   | Object.<string, string> | **true** | A map of <string, string>. Each key/value pair corresponds to an url parameter and the value to interpolate it with. |
| query    | Object.<string, any>    | **true** | A map that represents query parameters. Query parameters are appended to the url after the `?` character.            |
| anchor   | string                  | **true** | Load url to a specific anchor.                                                                                       |

# Keys

A sequencer allows you to listen for keypress on any html element and trigger actions whenever a combo is hit.

```jsx
import React from 'react';
import {Sequencer, literals} from '@anovel/tachyon';
import css from 'myStyle.module.css';

// Example with a copy/paste mock implementation.
const MyComponent = () => {
	const sequencer = new Sequencer();
	
	const combos = [
      {trigger: literals.COMBOS.COPY, action: () => console.log('I am copied!')},
      {trigger: literals.COMBOS.PASTE, action: () => console.log('I am paste!')}
    ];
	
	return (
		<div className={css.container}>
          <div
            onKeyDown={sequencer.update({combos})}
            onKeyUp={sequencer.remove}
          >Copy me (CTRL + C) or Paste me (CTRL + V)</div>
        </div>
    );
};
```

The Sequencer constructor does not take any arguments. Instead, every parameters are passed on the go through its
methods, which allows for highly dynamic behavior.

Sequencer ships with 4 public methods.

- [Sequencer.update](#sequencerupdate)
- [Sequencer.remove](#sequencerremove)
- [Sequencer.clear](#sequencerclear)
- [Sequencer.keys](#sequencerkeys)

## Sequencer.update

Update sequence and return the updated list of pressed keys in the sequence. Return the current pressed keys array.

```jsx
function handler(e) {
	const keys = sequencer.update(options)(e);
}
```

**Arguments**

| Argument | Type    | Required | Description                                 |
| :---     | :---    | :---     | :---                                        |
| options  | Object  | -        | Arguments to control key sequence behavior. |

**Options**

| Key      | Type     | Description                                                                                                                                                                            |
| :---     | :---     | :---                                                                                                                                                                                   |
| lifespan | number   | Automatically removes the key from the chain passed a certain amount of time (in milliseconds). If not set, key should be removed manually with the [remove](#sequencerremove) method. |
| sustain  | boolean  | If set to true, a new entry will automatically reset all timers for each key in the sequence. If a key was not timed, it will initialize a new timer on it.                            |
| combos   | []Object | List of actions to take if a valid sequence of keys is matched.                                                                                                                        |

**Combo**

| Key                | Required | Type     | Description                                                                                                                                     |
| :---               | :---     | :---     | :---                                                                                                                                            |
| trigger            | **true** | []string | The sequence of keys to trigger an action. Each element must correspond to a valid `keycode` attribute (of a KeyboardEvent).                    |
| action             | **true** | function | Run this action (with no arguments) when the current sequences array ends with the keys in `trigger`.                                           |
| intermediateAction | -        | function | Run this function when the current sequence partially matches `trigger`. Takes the number of triggered keys as an argument.                     |
| alwaysTrigger      | -        | boolean  | If true and `intermediateAction` is set, runs intermediateAction on any keypress when `action` is not triggered, even if trigger has 0 matches. |

## Sequencer.remove

Remove all occurences of a keycode from the sequence. Takes a KeyboardEvent as argument. Return the current pressed 
keys array.

```jsx
function handler(e) {
	const keys = sequencer.remove(e);
}
```

## Sequencer.clear

Empty (reset) the current key chain.

```jsx
sequencer.clear();
```

## Sequencer.keys

Return the current pressed keys array.

```jsx
const keys = sequencer.keys();
```

# License

[Licensed under MIT for A-Novel](https://github.com/a-novel/tachyon/blob/master/LICENSE).