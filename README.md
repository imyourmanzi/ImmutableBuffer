# Immutable Buffer

Adding types to the Immutable Buffer from the 3rd edition of Node.js Design Patterns.

## Background

I saw the original code for this on page 251 (chapter 7) and thought, _it would be a fun challenge to implement this in TypeScript_, and I was right. Since the example implementation was not completely fleshed out, I had to make a few modifications to the class itself, however, most of the code is the same.

**Let it be known that this is not supposed to be an actual utility (let alone production-ready), this is just a TypeScript exercise.**

## Ideas & Areas of Interest

- Getting the `ImmutableBuffer` to work with the index access (`[]`) operator
- More comprehensive tests, especially for the methods that needed to be overridden
- ESLint for fun and to make sure I'm not cheating too much
