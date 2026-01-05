import { Fraction, MixedFraction } from '../types';

// Greatest Common Divisor
export const gcd = (a: number, b: number): number => {
  if (!b) return Math.abs(a);
  return gcd(b, a % b);
};

export const simplifyFraction = (numerator: number, denominator: number): Fraction => {
  const common = gcd(numerator, denominator);
  return {
    numerator: numerator / common,
    denominator: denominator / common
  };
};

export const convertToMixed = (numerator: number, denominator: number): MixedFraction | null => {
  if (denominator === 0) return null;

  const isNegative = (numerator < 0) !== (denominator < 0);
  const absNum = Math.abs(numerator);
  const absDen = Math.abs(denominator);

  const whole = Math.floor(absNum / absDen);
  const remNum = absNum % absDen;

  const simplifiedRemainder = simplifyFraction(remNum, absDen);

  return {
    whole,
    numerator: simplifiedRemainder.numerator,
    denominator: simplifiedRemainder.denominator,
    isNegative
  };
};
