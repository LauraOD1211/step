/*good-file.js*/

/**This is a mock javascript file made using
 the sample code from the style guide **/

/* Best: perfectly clear even without a comment. */
const units = 'μs';

/* Allowed: but unncessary as μ is a printable character. */
const units = '\u03bcs'; // 'μs'

/* Good: use escapes for non-printable characters with a comment for clarity. */
return '\ufeff' + content;  // Prepend a byte order mark.

goog.module('search.urlHistory.UrlHistoryService');

goog.module('my.test.helpers');
goog.module.declareLegacyNamespace();
goog.setTestOnly();

const /** !Array<number> */ exportedArray = [1, 2, 3];

const /** !Array<number> */ moduleLocalArray = [4, 5, 6];

/** @return {number} */
function moduleLocalFunction() {
  return moduleLocalArray.length;
}

/** @return {number} */
function exportedFunction() {
  return moduleLocalFunction() * 2;
}

exports = {exportedArray, exportedFunction};

/** @const {number} */
exports.CONSTANT_ONE = 1;

/** @const {string} */
exports.CONSTANT_TWO = 'Another constant';

import './sideeffects.js';

import * as goog from '../closure/goog/goog.js';
import * as parent from '../parent.js';

import {name} from './sibling.js';

import '../directory/file.js';

import * as fileOne from '../file-one.js';
import * as fileTwo from '../file_two.js';
import * as fileThree from '../filethree.js';
import * as libString from './lib/string.js';
import * as math from './math/math.js';
import * as vectorMath from './vector/math.js';

import MyClass from '../my-class.js';
import myFunction from '../my_function.js';
import SOME_CONSTANT from '../someconstant.js';

import * as bigAnimals from './biganimals.js';
import * as domesticatedAnimals from './domesticatedanimals.js';

new bigAnimals.Cat();
new domesticatedAnimals.Cat();

import {Cat as BigCat} from './biganimals.js';
import {Cat as DomesticatedCat} from './domesticatedanimals.js';

new BigCat();
new DomesticatedCat();

// Use named exports:
export class Foo { ... }
// Alternate style named exports:
class Foo { ... }

export {Foo};

/** @return {number} */
export function bar() {
  return 1;
}

export const /** number */ FOO = 1;

// Good: Rather than export the mutable variables foo and mutateFoo directly,
// instead make them module scoped and export a getter for foo and a wrapper for
// mutateFooFunc.
let /** number */ foo = 0;
let /** function(number): number */ mutateFooFunc = foo => foo + 1;

/** @return {number} */
export function getFoo() {
  return foo;
}

export function mutateFoo() {
  foo = mutateFooFunc(foo);
}

/** @param {function(number): number} mutateFoo */
export function setMutateFoo(mutateFoo) {
  mutateFooFunc = mutateFoo;
}

export {specificName} from './other.js';
export * from './another.js';

import * as goog from '../closure/goog/goog.js';

const name = goog.require('a.name');

export const CONSTANT = name.compute();

import * as goog from '../closure/goog/goog.js';
import * as anEsModule from './anEsModule.js';

const GoogPromise = goog.require('goog.Promise');
const myNamespace = goog.require('my.namespace');

import * as goog from '../closure/goog.js';

goog.declareModuleId('my.esm');

export class Class {};

// Standard alias style.
const MyClass = goog.require('some.package.MyClass');
const MyType = goog.requireType('some.package.MyType');
// Namespace-based alias used to disambiguate.
const NsMyClass = goog.require('other.ns.MyClass');
// Namespace-based alias used to prevent masking native type.
const RendererElement = goog.require('web.renderer.Element');
// Out of sequence namespace-based aliases used to improve readability.
// Also, require lines longer than 80 columns must not be wrapped.
const SomeDataStructureModel = goog.requireType('identical.package.identifiers.models.SomeDataStructure');
const SomeDataStructureProto = goog.require('proto.identical.package.identifiers.SomeDataStructure');
// Standard alias style.
const asserts = goog.require('goog.asserts');
// Namespace-based alias used to disambiguate.
const testingAsserts = goog.require('goog.testing.asserts');
// Standard destructuring into aliases.
const {clear, clone} = goog.require('goog.array');
const {Rgb} = goog.require('goog.color');
// Namespace-based destructuring into aliases in order to disambiguate.
const {SomeType: FooSomeType} = goog.requireType('foo.types');
const {clear: objectClear, clone: objectClone} = goog.require('goog.object');
// goog.require without an alias in order to trigger side effects.
/** @suppress {extraRequire} Initializes MyFramework. */
goog.require('my.framework.initialization');

if (shortCondition()) foo();

class InnerClass {
  constructor() {}

  /** @param {number} foo */
  method(foo) {
    if (condition(foo)) {
      try {
        // Note: this might fail.
        something();
      } catch (err) {
        recover();
      }
    }
  }
}

function doNothing() {}

const a = [
  0,
  1,
  2,
];

const b =
    [0, 1, 2];
const c = [0, 1, 2];

someMethod(foo, [
  0, 1, 2,
], bar);

const a = {
  a: 0,
  b: 1,
};

const b =
    {a: 0, b: 1};
const c = {a: 0, b: 1};

someMethod(foo, {
  a: 0, b: 1,
}, bar);


class Foo {
  constructor() {
    /** @type {number} */
    this.x = 42;
  }

  /** @return {number} */
  method() {
    return this.x;
  }
}
Foo.Empty = class {};
/** @extends {Foo<string>} */
foo.Bar = class extends Foo {
  /** @override */
  method() {
    return super.method() / 2;
  }
};

/** @interface */
class Frobnicator {
  /** @param {string} message */
  frobnicate(message) {}
}

prefix.something.reallyLongFunctionName('whatever', (a1, a2) => {
  // Indent the function body +2 relative to indentation depth
  // of the 'prefix' statement one line above.
  if (a1.equals(a2)) {
    someOtherLongFunctionName(a1);
  } else {
    andNowForSomethingCompletelyDifferent(a2.parrot);
  }
});

some.reallyLongFunctionCall(arg1, arg2, arg3)
    .thatsWrapped()
    .then((result) => {
      // Indent the function body +2 relative to the indentation depth
      // of the '.then()' call.
      if (result) {
        result.use();
      }
    });

switch (animal) {
  case Animal.BANDERSNATCH:
    handleBandersnatch();
    break;

  case Animal.JABBERWOCK:
    handleJabberwock();
    break;

  default:
    throw new Error('Unknown animal');
}

currentEstimate =
    calc(currentEstimate + x * currentEstimate) /
        2.0;

{
  tiny: 42, // this is great
  longer: 435, // this too
};

{
  tiny:   42,  // permitted, but future edits
  longer: 435, // may leave it unaligned
};

// Arguments start on a new line, indented four spaces. Preferred when the
// arguments don't fit on the same line with the function name (or the keyword
// "function") but fit entirely on the second line. Works with very long
// function names, survives renaming without reindenting, low on space.
doSomething(
    descriptiveArgumentOne, descriptiveArgumentTwo, descriptiveArgumentThree) {
  // …
}

// If the argument list is longer, wrap at 80. Uses less vertical space,
// but violates the rectangle rule and is thus not recommended.
doSomething(veryDescriptiveArgumentNumberOne, veryDescriptiveArgumentTwo,
    tableModelEventHandlerProxy, artichokeDescriptorAdapterIterator) {
  // …
}

// Four-space, one argument per line.  Works with long function names,
// survives renaming, and emphasizes each argument.
doSomething(
    veryDescriptiveArgumentNumberOne,
    veryDescriptiveArgumentTwo,
    tableModelEventHandlerProxy,
    artichokeDescriptorAdapterIterator) {
  // …
}

/*
 * This is
 * okay.
 */

// And so
// is this.

/* This is fine, too. */

someFunction(obviousParam, true /* shouldRender */, 'hello' /* name */);

someFunction(obviousParam, /* shouldRender= */ true, /* name= */ 'hello');

const /** !Array<number> */ data = [];

/**
 * Some description.
 * @type {!Array<number>}
 */
const data = [];

const values = [
  'first value',
  'second value',
];

const a1 = [x1, x2, x3];
const a2 = [x1, x2];
const a3 = [x1];
const a4 = [];

const [a, b, c, ...rest] = generateResults();
let [, b,, d] = someArray;

/** @param {!Array<number>=} param1 */
function optionalDestructuring([a = 4, b = 2] = []) { … };

[...foo]   // preferred over Array.prototype.slice.call(foo)
[...foo, ...bar]   // preferred over foo.concat(bar)

/** @type {{width: number, maxWidth: (number|undefined)}} */
const o = {width: 42};
if (o.maxWidth != null) {
  ...
}

return {
  stuff: 'candy',
  method() {
    return this.stuff;  // Returns 'candy'
  },
};

class {
  getObjectLiteral() {
    this.stuff = 'fruit';
    return {
      stuff: 'candy',
      method: () => this.stuff,  // Returns 'fruit'
    };
  }
}


const foo = 1;
const bar = 2;
const obj = {
  foo,
  bar,
  method() { return this.foo + this.bar; },
};
assertEquals(3, obj.method());


