# diyai

> Dependency Injection (DI) made easy in JavaScript/ES6

[![npm](https://img.shields.io/npm/v/diyai.svg)](https://www.npmjs.com/package/diyai) [![Build Status](https://img.shields.io/travis/fahad19/diyai/master.svg)](http://travis-ci.org/fahad19/diyai) [![Coverage](https://img.shields.io/coveralls/fahad19/diyai.svg)](https://coveralls.io/github/fahad19/diyai)

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save diyai
```

With [unpkg](https://unpkg.com) CDN:

```html
<script src="https://unpkg.com/diyai@0.x/dist/diyai.min.js"></script>
<script>
 // now available in `window.Diyai`
</script>
```

## Usage

### Direct values

Let's start by defining a simple container first.

When defining the providers, we can directly assign values for them via the `useValue` key.

```js
import { createContainer, resolveContainer } from 'diyai';

const Container = createContainer([
  { name: 'foo', useValue: 'foo value' },
  { name: 'bar', useValue: 'bar value' }
]);
```

Now, let's resolve it to get the Container's instance:

```js
const container = resolveContainer(Container); // same as `new Container()`
```

Once resolved, you can get instaces of your providers as follows:

```js
container.get('foo'); // `foo value`
container.get('bar'); // `bar value`
```

If there is any chance of having a cyclic reference, you can use `useDefinedValue`:

```js
const myObj = {};

const Container = createContainer([
  { name: 'myObj', useDefinedValue: myObj }
]);

myObj.container = resolveContainer(Container);
```

Doing so would set a self-refernce of `myObj` in `myObj.container.registry.myObj` using `Object.defineProperty` via a getter function.

### Values from factories

We can also pass functions in the Container definition for the providers, and their returned values will be used as the actual value then.

For that, we will use the `useFactory` key:

```js
import { createContainer, resolveContainer } from 'diyai';

const Container = createContainer([
  { name: 'foo', useFactory: () => 'foo value' },
]);

const container = resolveContainer(Container);
container.get('foo'); // `foo value`
```

### Classes

Some providers can even be classes, and can be passed in the Container definition in `useClass` key.

Once resolved, the container would then return the instance of the class.

Classes can be just plain ES6 classes:

```js
class Foo {
  text() {
    return 'foo text'
  }
}
```

Or, they can be created with the handy `createClass` function shipped with this library:

```js
import { createClass } from 'diyai';

const Foo = createClass({
  text: function () {
    return 'foo text';
  }
});
```

Once the class is written, we can define our container:

```js
const Container = createContainer([
  { name: 'foo', useClass: Foo }
]);
```

Which can now be resolved as follows:

```js
const container = resolveContainer(Container);

const fooInstance = container.get('foo');
fooInstance.text(); // `foo text`
```

### Dependencies

Dependencies can be handled while defining the providers.

Let's say you have a `Foo` and `Bar` classes, and Bar depends on Foo:

```js
class Foo {
  text() {
    return 'foo text';
  }
}

class Bar {
  constructor({ foo }) { // instance of Foo is given as constructor argument
    this.foo = foo;
  }

  fooText() {
    return this.foo.text();
  }
}
```

Once we have them as classes, we can pass them on to our container definition as follows:

```js
const Container = createContainer([
  { name: 'foo', useClass: Foo },
  { name: 'bar', useClass: Bar, deps: ['foo'] }
]);
```

We are telling our Container that when `bar` is instantiated, pass the instance of `foo` to its constructor.

```js
const container = resolveContainer(Container);

const bar = container.get('bar');
bar.fooText(); // `foo text`
```

The `deps` key can also be provided as an object instead of an array, where the keys are the container's provider names, and values are the names the target class is expecting.

## API

### `createClass(extend = {})`

Creates and returns a class.

```js
import { createClass } from 'diyai';

const MyClass = createClass({
  initialize(deps) {
    // `deps` contains injected dependencies if any.
    // Should be treated as constructors of ES6 classes.
  },

  someMethod() {
    return true;
  }
});
```

### `resolveContainer(Container)`

Returns instance of resolved container.

### `createContainer(providers = [], options = {})`

Creates and returns a container class.

#### `providers`

An array of providers.

A single provider object would contain:

```js
{
  name: 'uniqueNameHere',

  // and one of the following keys
  useValue: 'direct value of any type', // OR
  useFactory: () => 'returned value of any type', OR
  useClass: SomeClass, // created via `createClass` or ES6 classes

  // if `useClass` or `useFactory` is used, then `deps` can be provided
  deps: ['depName1', 'depName2', ...]

  // `deps` can also be an object:
  deps: { nameInContainer: 'nameExpectedInArgs' }
}
```

#### `options`

* `containerName`: defaults to `container`.

This means, the container instance itself can be obtained as:

```js
container.get('container'); // `container` instance
```

## Thanks

* [Angular 2](https://angular.io): For their `Injector`, since this project is an implementation of that in ES6 with no external dependencies.

## License

MIT © [Fahad Ibnay Heylaal](http://fahad19.com)
