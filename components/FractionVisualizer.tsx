import React from 'react';
import { MixedFraction } from '../types';

interface FractionVisualizerProps {
  data: MixedFraction;
  originalDenominator: number;
}

export const FractionVisualizer: React.FC<FractionVisualizerProps> = ({ data }) => {
  const { whole, numerator, denominator } = data;
  
  // Limit visualization to avoid rendering thousands of circles
  const MAX_WHOLE_CIRCLES = 10;
  const showOverflow = whole > MAX_WHOLE_CIRCLES;
  const renderWhole = showOverflow ? 1 : whole;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-slate-200 mt-6">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Visual Representation</h3>
      
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {showOverflow && (
            <div className="text-2xl font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">
                {whole} × Whole
            </div>
        )}

        {!showOverflow && Array.from({ length: renderWhole }).map((_, i) => (
          <div key={`whole-${i}`} className="relative w-16 h-16">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="45" fill="#4f46e5" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">1</div>
          </div>
        ))}

        {numerator > 0 && (
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* Background Circle */}
              <circle cx="50" cy="50" r="45" fill="#e2e8f0" />
              {/* Segment */}
              <path
                d={getPieSlicePath(50, 50, 45, 0, (numerator / denominator) * 360)}
                fill="#818cf8"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-medium text-xs">
              {numerator}/{denominator}
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 text-xs text-slate-400">
        Visualizing {showOverflow ? `a large number` : `${whole} whole(s)`} {numerator > 0 ? `and ${numerator}/${denominator} of a whole` : ''}.
      </p>
    </div>
  );
};

// Helper to create SVG arc path
function getPieSlicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    if (endAngle >= 360) {
         return `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy - 0.0001}`; // Full circle hack
    }
    
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", cx, cy,
        "L", start.x, start.y,
        "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
        "L", cx, cy
    ].join(" ");
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}
