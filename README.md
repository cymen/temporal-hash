# Temporal Hash [![Build Status](https://travis-ci.org/cymen/temporal-hash.svg?branch=master)](https://travis-ci.org/cymen/temporal-hash)

## `update(hash, timestamp)`

 * hash - the data to add to the temporal hash
 * timestamp - optional defaulting to `Date.now()`

## `resolve()`

Deep merge all of the hashes in order by time ascending and return the result.

## `compact(timestamp)`

 * timestamp - optional defaulting to `Date.now()`

Same as `resolve()` however also clears internal store and adds one value to
the store at the provided timestamp.

# lodash.merge, `null` and `undefined`

Using lodash [merge](https://lodash.com/docs#merge) which by default ignores
when keys have a value of undefined -- so keys can't be cleared. For example,

```javascript
var _ = require('lodash');

_.merge({a: 10, q: 20}, {a: 42, q: undefined})
```

Returns:

```javascript
{ a: 42, q: 20 }
```

However, if `q: null`, we would end up with:

```javascript
{ a: 42, q: null }
```

It would be preferable to have `q` get cleared if it were set to `undefined` so
that behavior will eventually be implemented.
