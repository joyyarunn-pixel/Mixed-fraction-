export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface MixedFraction {
  whole: number;
  numerator: number;
  denominator: number;
  isNegative: boolean;
}

export interface ExplanationState {
  text: string;
  loading: boolean;
  error: string | null;
}
