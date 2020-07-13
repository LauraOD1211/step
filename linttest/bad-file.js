
/* Poor: the reader has no idea what character this is. */
const units = '\u03bcs';

goog.module('foo.bar');   // 'foo.bar.qux' would be fine, though
goog.module('foo.bar.baz');

/** @const */
exports = {exportedFunction};

import '../directory/file';
// Imports have the same path, but since it doesn't align it can be hard to see.
import {short} from './long/path/to/a/file.js';
import {aLongNameThatBreaksAlignment} from './long/path/to/a/file.js';

// Do not use default exports:
export default class Foo { ... } // BAD!

// container.js
// Bad: Container is an exported class that has only static methods and fields.
export class Container {
  /** @return {number} */
  static bar() {
    return 1;
  }
}

/** @const {number} */
Container.FOO = 1;

// Bad: both foo and mutateFoo are exported and mutated.
export let /** number */ foo = 0;

/**
 * Mutates foo.
 */
export function mutateFoo() {
  ++foo;
}

/**
 * @param {function(number): number} newMutateFoo
 */
export function setMutateFoo(newMutateFoo) {
  // Exported classes and functions can be mutated!
  mutateFoo = () => {
    foo = newMutateFoo(foo);
  };
}

// a.js
import './b.js';
// b.js
import './a.js';

// `export from` can cause circular dependencies too!
export {x} from './c.js';
// c.js
import './b.js';

export let x;

// Extra terms must come from the namespace.
const MyClassForBizzing = goog.require('some.package.MyClass');
// Alias must include the entire final namespace component.
const MyClass = goog.require('some.package.MyClassForBizzing');
// Alias must not mask native type (should be `const JspbMap` here).
const Map = goog.require('jspb.Map');
// Don't break goog.require lines over 80 columns.
const SomeDataStructure =
    goog.require('proto.identical.package.identifiers.SomeDataStructure');
// Alias must be based on the namespace.
const randomName = goog.require('something.else');
// Missing a space after the colon.
const {Foo:FooProto} = goog.require('some.package.proto.Foo');
// goog.requireType without an alias.
goog.requireType('some.package.with.a.Type');


/**
 * @param {!some.unimported.Dependency} param All external types used in JSDoc
 *     annotations must be goog.require'd, unless declared in externs.
 */
function someFunction(param) {
  // goog.require lines must be at the top level before any other code.
  const alias = goog.require('my.long.name.alias');
  // ...
}

if (someVeryLongCondition())
  doSomething();

for (let i = 0; i < foo.length; i++) bar(foo[i]);

if (condition) {
  // …
} else if (otherCondition) {} else {
  // …
}

try {
  // …
} catch (e) {}

/** Some description. */
const /** !Array<number> */ data = [];

const a1 = new Array(x1, x2, x3);
const a2 = new Array(x1, x2);
const a3 = new Array(x1);
const a4 = new Array();

function badDestructuring([a, b] = [4, 2]) { … };

{
  width: 42, // struct-style unquoted key
  'maxWidth': 43, // dict-style quoted key
}

/** @type {{width: number, maxWidth: (number|undefined)}} */
const o = {width: 42};
if (o.hasOwnProperty('maxWidth')) {
  ...
}

/** @param {{x: {num: (number|undefined), str: (string|undefined)}}} param1 */
function nestedTooDeeply({x: {num, str}}) {};
/** @param {{num: (number|undefined), str: (string|undefined)}=} param1 */
function nonShorthandProperty({num: a, str: b} = {}) {};
/** @param {{a: number, b: number}} param1 */
function computedKey({a, b, [a + b]: c}) {};
/** @param {{a: number, b: string}=} param1 */
function nontrivialDefault({a, b} = {a: 2, b: 4}) {};

class Base { /** @nocollapse */ static foo() {} }
class Sub extends Base {}
function callFoo(cls) { cls.foo(); }  // discouraged: don't call static methods dynamically
Sub.foo();  // Disallowed: don't call static methods on subclasses that don't define it themselves

class Foo {
  get next() { return this.nextId++; }
}

/**
 * A function with no params and no returned value.
 * This single expression body usage is illegal because the program logic does
 * not require returning a value and we're missing the `void` operator.
 */
const moduleLocalFunc = () => anotherFunction();

const longString = 'This is a very long string that far exceeds the 80 \
    column limit. It unfortunately contains long stretches of spaces due \
    to how the continued lines are indented.';


try {
    shouldFail();
    fail('expected an error');
  } catch (expected) {
  }

const /** Boolean */ x = new Boolean(false);
if (x) alert(typeof x);  // alerts 'object' - WAT?


new Foo;


