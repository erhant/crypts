export * from './primality';
export * from './sqrt';
export * from './random';
export * from './legendre';

/** A union of numeric types, suitable for `BigInt` constructor. */
export type Integer = string | number | bigint | boolean;
