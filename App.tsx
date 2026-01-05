import React, { useState, useEffect, useCallback } from 'react';
import { Fraction, MixedFraction, ExplanationState } from './types';
import { convertToMixed } from './utils/math';
import { getFractionExplanation } from './services/geminiService';
import { FractionVisualizer } from './components/FractionVisualizer';
import { AIExplanation } from './components/AIExplanation';

const App: React.FC = () => {
  const [numerator, setNumerator] = useState<string>('5');
  const [denominator, setDenominator] = useState<string>('2');
  const [result, setResult] = useState<MixedFraction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiState, setAiState] = useState<ExplanationState>({
    text: '',
    loading: false,
    error: null
  });

  // Calculate whenever inputs change
  useEffect(() => {
    // Reset AI explanation when numbers change
    if (aiState.text || aiState.error) {
       setAiState({ text: '', loading: false, error: null });
    }

    const num = parseInt(numerator);
    const den = parseInt(denominator);

    if (isNaN(num) || isNaN(den)) {
      setResult(null);
      setError('Please enter valid integers.');
      return;
    }

    if (den === 0) {
      setResult(null);
      setError('Denominator cannot be zero.');
      return;
    }

    setError(null);
    const mixed = convertToMixed(num, den);
    setResult(mixed);
  }, [numerator, denominator]);

  const handleExplain = async () => {
    const num = parseInt(numerator);
    const den = parseInt(denominator);
    
    if (isNaN(num) || isNaN(den) || den === 0) return;

    setAiState({ text: '', loading: true, error: null });
    try {
      const explanation = await getFractionExplanation(num, den);
      setAiState({ text: explanation, loading: false, error: null });
    } catch (e) {
      setAiState({ text: '', loading: false, error: 'Could not fetch explanation. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Mixed Fraction <span className="text-indigo-600">Converter</span>
          </h1>
          <p className="mt-2 text-slate-600">
            Convert improper fractions (a/b) to mixed numbers instantly.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-8">
            <div className="flex items-center justify-center space-x-4 mb-8">
              {/* Numerator / Denominator Inputs */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <label htmlFor="numerator" className="sr-only">Numerator</label>
                  <input
                    id="numerator"
                    type="number"
                    value={numerator}
                    onChange={(e) => setNumerator(e.target.value)}
                    className="w-24 h-24 text-center text-4xl font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder-slate-300"
                    placeholder="a"
                  />
                  <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-slate-300 font-serif italic">a</span>
                </div>
                
                <div className="w-full h-1 bg-slate-300 rounded-full"></div>

                <div className="relative">
                  <label htmlFor="denominator" className="sr-only">Denominator</label>
                  <input
                    id="denominator"
                    type="number"
                    value={denominator}
                    onChange={(e) => setDenominator(e.target.value)}
                    className="w-24 h-24 text-center text-4xl font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder-slate-300"
                    placeholder="b"
                  />
                  <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-slate-300 font-serif italic">b</span>
                </div>
              </div>

              <div className="text-3xl text-slate-300 font-light">=</div>

              {/* Result Display */}
              <div className="min-w-[140px] flex items-center justify-center">
                {error ? (
                  <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded">
                    {error}
                  </div>
                ) : result ? (
                   <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {result.whole !== 0 && (
                        <span className="text-6xl font-black text-indigo-600 tracking-tight">
                            {result.isNegative && '-'}{Math.abs(result.whole)}
                        </span>
                      )}
                      {result.numerator !== 0 && (
                          <div className="flex flex-col items-center justify-center gap-1">
                              <span className="text-3xl font-bold text-slate-700 border-b-2 border-slate-800 px-1">
                                  {result.numerator}
                              </span>
                              <span className="text-3xl font-bold text-slate-700 px-1">
                                  {result.denominator}
                              </span>
                          </div>
                      )}
                       {result.whole === 0 && result.numerator === 0 && (
                           <span className="text-6xl font-black text-slate-400">0</span>
                       )}
                   </div>
                ) : (
                  <span className="text-slate-300 italic">...</span>
                )}
              </div>
            </div>
            
            {/* Visualizer */}
            {result && !error && (Math.abs(result.whole) < 100) && (
                <FractionVisualizer 
                    data={result} 
                    originalDenominator={parseInt(denominator) || 1} 
                />
            )}

            {/* AI Section */}
            <AIExplanation 
                explanation={aiState} 
                onAsk={handleExplain} 
                canAsk={!!result && !error}
            />

          </div>
        </div>
        
        <div className="text-center text-slate-400 text-sm">
          <p>Try inputs like <strong>7/2</strong>, <strong>25/4</strong>, or <strong>100/3</strong></p>
        </div>
      </div>
    </div>
  );
};

export default App;
