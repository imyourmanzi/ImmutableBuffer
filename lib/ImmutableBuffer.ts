// imports both the class and its types
import { Buffer } from 'buffer';

// identify the methods that can modify a buffer by their name/prefix
const MODIFIER_NAMES = [
  'set',
  'write',
  'swap',
  'fill',
  'reverse',
  'copyWithin',
  'sort',
  'buffer',
] as const;
type ModifierMethodNameFormat = `${typeof MODIFIER_NAMES[number]}${string}`;

// extract various sub-groups of the method names from the Buffer type
type BufferMethod = Exclude<keyof Buffer, number | symbol>;
type BufferModifierMethod = Extract<keyof Buffer, ModifierMethodNameFormat>;

/**
 * Determine if a string is the name of a method in the {@link Buffer} class.
 *
 * @param p a method name to check for
 * @param buffer the buffer to check membership in
 * @returns `true` if the name is a valid method, `false` otherwise
 */
const isBufferMethod = (p: string, buffer: Buffer): p is BufferMethod => p in buffer;

// build two Buffer sub-types: one with just the modifiers, another with everything but
// the modifier methods
type BufferModifiersOnly = Pick<Buffer, BufferModifierMethod>;
type BufferWithoutModifiers = Omit<Buffer, BufferModifierMethod>;

/**
 * Determine if a buffer method name is that of a modifier method.
 *
 * @param p a method name to check
 * @returns `true` if the name is a modifier method, `false` otherwise
 */
const isModifier = (p: BufferMethod): p is BufferModifierMethod =>
  MODIFIER_NAMES.some((m) => p.startsWith(m));

// create the signature of the function used to initialize the ImmutableBuffer
export type ImmutableBufferInitializer = (modifiers: BufferModifiersOnly) => void;

// take advantage of type merging to declare that an ImmutableBuffer includes all non-
// modification methods of a normal Buffer
// TODO: figure out how to get the index [] accessor working in here, maybe something like
// https://github.com/nodejs/node/blob/419f02ba1f00cac3c26b7f0e9a3c01624a8b87cc/lib/buffer.js#L344
export interface ImmutableBuffer extends BufferWithoutModifiers {}
export class ImmutableBuffer {
  private internal_buffer: Buffer;

  BYTES_PER_ELEMENT: number;
  length: number;
  byteLength: number;
  byteOffset: number;

  /**
   * Create a Buffer that cannot be mutated after it's initial construction.
   *
   * @param size how many bytes long to make the buffer (used in `Buffer.alloc(size)`)
   * @param initializer a function that allows initialization of the buffer's contents,
   * available only a construction-time
   */
  constructor(size: number, initializer: ImmutableBufferInitializer) {
    this.internal_buffer = Buffer.alloc(size);

    const modifiers = {} as BufferModifiersOnly;
    for (const prop in this.internal_buffer) {
      const method = this.internal_buffer[prop] as unknown;
      if (typeof method !== 'function') {
        continue;
      }

      if (!isBufferMethod(prop, this.internal_buffer)) {
        continue;
      }

      if (isModifier(prop)) {
        modifiers[prop] = method.bind(this.internal_buffer);
      } else {
        this[prop] = method.bind(this.internal_buffer);
      }
    }

    // run all user setup modifications on the internal buffer to initialize it
    initializer(modifiers);
    for (const prop in modifiers) {
      delete modifiers[prop];
    }

    this.BYTES_PER_ELEMENT = this.internal_buffer.BYTES_PER_ELEMENT;
    this.length = this.internal_buffer.length;
    this.byteLength = this.internal_buffer.byteLength;
    this.byteOffset = this.internal_buffer.byteOffset;
  }

  slice(start?: number, end?: number): Buffer {
    const subArray = this.internal_buffer.slice(start, end);
    const newBuffer = Buffer.alloc(subArray.length);
    subArray.copy(newBuffer);
    return newBuffer;
  }

  subarray(start?: number, end?: number): Buffer {
    const subArray = this.internal_buffer.subarray(start, end);
    const newBuffer = Buffer.alloc(subArray.length);
    subArray.copy(newBuffer);
    return newBuffer;
  }

  entries(): IterableIterator<[number, number]> {
    return this.internal_buffer.entries();
  }

  keys(): IterableIterator<number> {
    return this.internal_buffer.keys();
  }

  values(): IterableIterator<number> {
    return this.internal_buffer.values();
  }

  every(
    predicate: (value: number, index: number, array: Uint8Array) => unknown,
    thisArg?: any
  ): boolean {
    return this.internal_buffer.every(predicate, thisArg);
  }

  filter(
    predicate: (value: number, index: number, array: Uint8Array) => any,
    thisArg?: any
  ): Uint8Array {
    return this.internal_buffer.filter(predicate, thisArg);
  }

  find(
    predicate: (value: number, index: number, obj: Uint8Array) => boolean,
    thisArg?: any
  ): number {
    return this.internal_buffer.find(predicate, thisArg);
  }

  findIndex(
    predicate: (value: number, index: number, obj: Uint8Array) => boolean,
    thisArg?: any
  ): number {
    return this.internal_buffer.findIndex(predicate, thisArg);
  }

  forEach(
    callbackfn: (value: number, index: number, array: Uint8Array) => void,
    thisArg?: any
  ): void {
    return this.internal_buffer.forEach(callbackfn, thisArg);
  }

  join(separator?: string): string {
    return this.internal_buffer.join(separator);
  }

  map(
    callbackfn: (value: number, index: number, array: Uint8Array) => number,
    thisArg?: any
  ): Uint8Array {
    return this.internal_buffer.map(callbackfn, thisArg);
  }

  reduce(
    callbackfn: (
      previousValue: number,
      currentValue: number,
      currentIndex: number,
      array: Uint8Array
    ) => number
  ): number;
  reduce(
    callbackfn: (
      previousValue: number,
      currentValue: number,
      currentIndex: number,
      array: Uint8Array
    ) => number,
    initialValue: number
  ): number;
  reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: number,
      currentIndex: number,
      array: Uint8Array
    ) => U,
    initialValue: U
  ): U;
  reduce<U>(callbackfn: any, initialValue?: any): number | U {
    return this.internal_buffer.reduce(callbackfn, initialValue);
  }

  reduceRight(
    callbackfn: (
      previousValue: number,
      currentValue: number,
      currentIndex: number,
      array: Uint8Array
    ) => number
  ): number;
  reduceRight(
    callbackfn: (
      previousValue: number,
      currentValue: number,
      currentIndex: number,
      array: Uint8Array
    ) => number,
    initialValue: number
  ): number;
  reduceRight<U>(
    callbackfn: (
      previousValue: U,
      currentValue: number,
      currentIndex: number,
      array: Uint8Array
    ) => U,
    initialValue: U
  ): U;
  reduceRight<U>(callbackfn: any, initialValue?: any): number | U {
    return this.internal_buffer.reduceRight(callbackfn, initialValue);
  }

  some(
    predicate: (value: number, index: number, array: Uint8Array) => unknown,
    thisArg?: any
  ): boolean {
    return this.internal_buffer.some(predicate, thisArg);
  }

  at(index: number): number {
    return this.internal_buffer.at(index);
  }
}
