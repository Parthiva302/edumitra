import React, { useState } from 'react';
import { Sigma, CheckCircle, Calculator, ChevronRight } from 'lucide-react';

interface MathStep {
  step: string;
  math: string;
}

interface MathVisualizerProps {
  equation?: string;
  title?: string;
  steps?: MathStep[];
  className?: string;
}

export const MathVisualizer: React.FC<MathVisualizerProps> = ({
  equation = "f(x) = x^2 - 4x + 3",
  title = "Quadratic Function & Roots Derivation",
  steps = [
    { step: "1. Identify coefficients", math: "a = 1, \\; b = -4, \\; c = 3" },
    { step: "2. Calculate vertex coordinate", math: "x_v = -\\frac{b}{2a} = -\\frac{-4}{2(1)} = 2" },
    { step: "3. Evaluate minimum value at vertex", math: "f(2) = (2)^2 - 4(2) + 3 = -1" },
    { step: "4. Factoring for roots", math: "(x - 1)(x - 3) = 0 \\implies x_1 = 1, \\; x_2 = 3" }
  ],
  className = ''
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [xVal, setXVal] = useState<number>(2);

  // Calculate live value for y = x^2 - 4x + 3
  const yVal = Math.round(xVal * xVal - 4 * xVal + 3);

  return (
    <div className={`flex flex-col h-full bg-white border border-[#DCE4EC] rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#DCE4EC] bg-[#F5F7F8]">
        <div className="flex items-center gap-2">
          <Sigma className="w-4 h-4 text-[#4F7CAC]" />
          <span className="text-xs font-semibold text-[#17232D] tracking-tight">{title}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E8F1F7] text-[#4F7CAC] font-mono border border-[#D0E1EE]">
            Math Engine
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#61707C] font-medium">{equation}</span>
      </div>

      {/* Main Coordinate Graph & Derivation Split */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch bg-radial from-[#F5F7F8] to-[#E8EFF5]">
        {/* Dynamic Coordinate Curve Graph */}
        <div className="bg-white rounded-lg border border-[#DCE4EC] p-3 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-[#61707C]">Cartesian Plane: y = f(x)</span>
            <span className="text-[10px] font-mono bg-[#EAF4EE] text-[#5B9A7A] px-1.5 py-0.5 rounded font-bold">
              f({xVal}) = {yVal}
            </span>
          </div>

          {/* SVG Parabolic Curve Graph */}
          <div className="relative w-full aspect-[4/3] bg-[#F8FAFC] rounded border border-[#E8EFF5] flex items-center justify-center overflow-hidden">
            <svg viewBox="-5 -6 10 12" className="w-full h-full transform scale-y-[-1]">
              {/* Axes */}
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#CBD6E2" strokeWidth="0.2" />
              <line x1="0" y1="-6" x2="0" y2="6" stroke="#CBD6E2" strokeWidth="0.2" />
              
              {/* Grid markers */}
              {[-4, -2, 2, 4].map(x => (
                <line key={`x-${x}`} x1={x} y1="-0.2" x2={x} y2="0.2" stroke="#8D9AA6" strokeWidth="0.15" />
              ))}
              {[-4, -2, 2, 4].map(y => (
                <line key={`y-${y}`} x1="-0.2" y1={y} x2="0.2" y2={y} stroke="#8D9AA6" strokeWidth="0.15" />
              ))}

              {/* Parabolic Curve y = x^2 - 4x + 3 */}
              <path
                d="M -1 8 Q 2 -10 5 8"
                fill="none"
                stroke="#4F7CAC"
                strokeWidth="0.3"
              />

              {/* Roots (1,0) and (3,0) */}
              <circle cx="1" cy="0" r="0.25" fill="#5B9A7A" />
              <circle cx="3" cy="0" r="0.25" fill="#5B9A7A" />

              {/* Vertex (2, -1) */}
              <circle cx="2" cy="-1" r="0.3" fill="#C58B3A" />

              {/* Interactive Target Point (xVal, yVal) */}
              <circle cx={xVal} cy={Math.max(-5, Math.min(5, yVal))} r="0.35" fill="#B76565" stroke="white" strokeWidth="0.1" />
            </svg>

            {/* Labels */}
            <div className="absolute top-2 left-2 text-[9px] font-mono text-[#61707C] flex flex-col gap-0.5 bg-white/90 p-1 rounded shadow-xs">
              <span className="text-[#C58B3A] font-bold">● Vertex (2, -1)</span>
              <span className="text-[#5B9A7A] font-bold">● Roots x = 1, 3</span>
              <span className="text-[#B76565] font-bold">● Current ({xVal}, {yVal})</span>
            </div>
          </div>

          {/* Interactive X-Slider */}
          <div className="mt-2 pt-2 border-t border-[#DCE4EC]">
            <div className="flex justify-between text-[11px] text-[#61707C] mb-1">
              <span>Evaluate point x:</span>
              <span className="font-mono font-bold text-[#17232D]">x = {xVal}</span>
            </div>
            <input
              type="range"
              min="-1"
              max="5"
              step="0.5"
              value={xVal}
              onChange={(e) => setXVal(Number(e.target.value))}
              className="w-full h-1.5 bg-[#CBD6E2] rounded-lg appearance-none cursor-pointer accent-[#4F7CAC]"
            />
          </div>
        </div>

        {/* Step-by-Step Derivation Cards */}
        <div className="flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-medium text-[#61707C]">Step-by-Step Mathematical Derivation:</span>
          <div className="space-y-1.5 flex-1 overflow-y-auto">
            {steps.map((st, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                  activeStepIndex === idx
                    ? 'bg-[#E8F1F7] border-[#4F7CAC] shadow-xs'
                    : 'bg-white border-[#DCE4EC] hover:border-[#CBD6E2]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#17232D] text-[11px]">{st.step}</span>
                  {activeStepIndex === idx && <CheckCircle className="w-3.5 h-3.5 text-[#4F7CAC]" />}
                </div>
                <div className="font-mono text-[#4F7CAC] bg-white/80 p-1 rounded border border-[#DCE4EC]/50 font-bold text-[11px]">
                  {st.math}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
