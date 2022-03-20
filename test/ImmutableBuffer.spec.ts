import { ImmutableBuffer } from '../lib/ImmutableBuffer';

describe('ImmutableBuffer', () => {
  it('has all non-modifier methods of a Buffer', () => {
    const ib = new ImmutableBuffer(0, () => {});

    expect(ib).toHaveProperty('toString');
    expect(ib).toHaveProperty('toJSON');
    expect(ib).toHaveProperty('equals');
    expect(ib).toHaveProperty('compare');
    expect(ib).toHaveProperty('copy');
    expect(ib).toHaveProperty('slice');
    expect(ib).toHaveProperty('subarray');
    expect(ib).toHaveProperty('readBigUInt64BE');
    expect(ib).toHaveProperty('readBigUint64BE');
    expect(ib).toHaveProperty('readBigUInt64LE');
    expect(ib).toHaveProperty('readBigUint64LE');
    expect(ib).toHaveProperty('readBigInt64BE');
    expect(ib).toHaveProperty('readBigInt64LE');
    expect(ib).toHaveProperty('readUIntLE');
    expect(ib).toHaveProperty('readUintLE');
    expect(ib).toHaveProperty('readUIntBE');
    expect(ib).toHaveProperty('readUintBE');
    expect(ib).toHaveProperty('readIntLE');
    expect(ib).toHaveProperty('readIntBE');
    expect(ib).toHaveProperty('readUInt8');
    expect(ib).toHaveProperty('readUint8');
    expect(ib).toHaveProperty('readUInt16LE');
    expect(ib).toHaveProperty('readUint16LE');
    expect(ib).toHaveProperty('readUInt16BE');
    expect(ib).toHaveProperty('readUint16BE');
    expect(ib).toHaveProperty('readUInt32LE');
    expect(ib).toHaveProperty('readUint32LE');
    expect(ib).toHaveProperty('readUInt32BE');
    expect(ib).toHaveProperty('readUint32BE');
    expect(ib).toHaveProperty('readInt8');
    expect(ib).toHaveProperty('readInt16LE');
    expect(ib).toHaveProperty('readInt16BE');
    expect(ib).toHaveProperty('readInt32LE');
    expect(ib).toHaveProperty('readInt32BE');
    expect(ib).toHaveProperty('readFloatLE');
    expect(ib).toHaveProperty('readFloatBE');
    expect(ib).toHaveProperty('readDoubleLE');
    expect(ib).toHaveProperty('readDoubleBE');
    expect(ib).toHaveProperty('indexOf');
    expect(ib).toHaveProperty('lastIndexOf');
    expect(ib).toHaveProperty('entries');
    expect(ib).toHaveProperty('includes');
    expect(ib).toHaveProperty('keys');
    expect(ib).toHaveProperty('values');
    expect(ib).toHaveProperty('BYTES_PER_ELEMENT');
    expect(ib).toHaveProperty('byteLength');
    expect(ib).toHaveProperty('byteOffset');
    expect(ib).toHaveProperty('every');
    expect(ib).toHaveProperty('filter');
    expect(ib).toHaveProperty('find');
    expect(ib).toHaveProperty('findIndex');
    expect(ib).toHaveProperty('forEach');
    expect(ib).toHaveProperty('join');
    expect(ib).toHaveProperty('length');
    expect(ib).toHaveProperty('map');
    expect(ib).toHaveProperty('reduce');
    expect(ib).toHaveProperty('reduceRight');
    expect(ib).toHaveProperty('some');
    expect(ib).toHaveProperty('toLocaleString');
    expect(ib).toHaveProperty('valueOf');
    expect(ib).toHaveProperty('at');
  });

  it('creates a buffer', () => {
    let written: number;
    const myBuffer = new ImmutableBuffer(10, ({ write }) => {
      written = write('hello');
    });

    expect(written).toBe(5);
    expect(myBuffer.readUint8(0)).toBe('h'.charCodeAt(0));
    expect(myBuffer.at(0)).toBe('h'.charCodeAt(0));
    // NOTE: not implemented
    // expect(myBuffer[0]).toBe('h'.charCodeAt(0));
  });

  it('modifiers are inaccessible after construction completes', () => {
    let mySecretCopyOfModifiers = {};
    const myBuffer = new ImmutableBuffer(10, (modifiers) => {
      mySecretCopyOfModifiers = modifiers;
      modifiers.write('hello');
    });

    expect(mySecretCopyOfModifiers['write']).toBeFalsy();
    expect(myBuffer.at(0)).toBe('h'.charCodeAt(0));
  });
});
