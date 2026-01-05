import React from 'react';
import ReactMarkdown from 'react-markdown'; // Assuming standard markdown rendering if needed, but we'll stick to simple text for now or simple mapping
import { ExplanationState } from '../types';

interface AIExplanationProps {
  explanation: ExplanationState;
  onAsk: () => void;
  canAsk: boolean;
}

export const AIExplanation: React.FC<AIExplanationProps> = ({ explanation, onAsk, canAsk }) => {
  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Gemini Tutor</span>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">AI Powered</span>
        </h3>
        
        {!explanation.text && !explanation.loading && canAsk && (
          <button
            onClick={onAsk}
            className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Explain steps
          </button>
        )}
      </div>

      {explanation.loading && (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      )}

      {explanation.error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
          {explanation.error}
        </div>
      )}

      {explanation.text && !explanation.loading && (
        <div className="prose prose-slate prose-sm max-w-none bg-slate-50 p-6 rounded-xl border border-slate-100">
           <div className="whitespace-pre-line leading-relaxed text-slate-700">
             {explanation.text}
           </div>
        </div>
      )}
    </div>
  );
};
