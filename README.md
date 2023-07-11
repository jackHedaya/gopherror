# GophError

A dependency-free, simple error wrapper for Go-style error handling in TypeScript. Handle errors without try/catch blocks.

## Installation

```bash
yarn add gopherror
```

## Usage

```javascript
import { GophError, GophTuple } from 'gopherror'

function throwableFn1() {
  throw new Error('Something tragic went wrong')
}

function throwableFn2(): GophTuple<number> {
  const [res, err] = GophError.from(throwableFn)

  if (err) {
    return GophError.wrap(err, 'my function errored :(')
  }

  return [1, null]
}

const [res, err] = throwanleFn2()

if (err) {
  console.error(err.unwrapAll().message)
  // Something tragic went wrong

  console.error(err.messageStack())
  // my function errored :(
  // Something tragic went wrong
}
```

## API

### GophError

#### `GophError.from<T>(fn: () => T): GophTuple<T>`

Catches a function that may throw an error. Returns a tuple of the result and the error.

#### `GophError.fromAsync<T>(fn: () => Promise<T>): Promise<GophTuple<T>>`

Catches an async function that may throw an error. Returns a promise of a tuple of the result and the error.

#### `wrap<T>(err: Error, message: string): GophTuple<T>`

Wraps an error with a message. Returns a tuple of the result and the error. Also exists as a static method on `GophError`.

#### `unwrap<(): Error | GophError | null`

Unwraps the child error. Returns the error or null if there is no error.

#### `unwrapAll(): Error | GophError`

Unwraps all errors in the stack. Returns the last error in the stack. If there is no error, returns itself.

#### `messageStack(): string`

Returns a string of all the error messages in the stack separated by newlines. The first message is the lowest level error.
