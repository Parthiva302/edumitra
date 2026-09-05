import React from 'react';
import { BookOpen, Check, Lightbulb } from 'lucide-react';

interface ConceptCardVisualProps {
  title?: string;
  formula?: string;
  unit?: string;
  points?: string[];
  batteryVoltage?: number;
}

export const ConceptCardVisual: React.FC<ConceptCardVisualProps> = ({
  title = "Core Principle",
  formula,
  unit,
  points = []
}) => {
  return (
    <div id="concept-whiteboard-card" className="w-full h-full flex flex-col justify-between bg-white border border-[#DCE4EC] rounded-2xl p-5 md:p-6 text-[#17232D] shadow-xs">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-[#DCE4EC] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F7CAC] font-bold">
                Classroom Whiteboard
              </span>
              <h3 className="text-base md:text-lg font-bold text-[#17232D]">{title}</h3>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-md bg-[#F3F7FA] text-[#61707C] border border-[#DCE4EC] font-medium">
            Active Focus
          </span>
        </div>

        {/* Highlighted Formula Block */}
        {formula && (
          <div className="my-4 bg-[#F3F7FA] border border-[#DCE4EC] rounded-xl p-5 text-center shadow-xs">
            <span className="text-[11px] text-[#61707C] font-semibold uppercase tracking-wider block mb-1">
              Fundamental Formula
            </span>
            <div className="text-2xl md:text-3xl font-mono font-extrabold text-[#4F7CAC] tracking-wider">
              {formula}
            </div>
            {unit && (
              <p className="text-xs text-[#61707C] mt-1 font-mono">
                SI Unit: <strong className="text-[#5B9A7A]">{unit}</strong>
              </p>
            )}
          </div>
        )}

        {/* Structured Concept Points */}
        {points.length > 0 && (
          <div className="space-y-2.5 my-3">
            {points.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-[#F3F7FA] border border-[#DCE4EC] rounded-xl p-3 text-sm text-[#17232D]">
                <div className="w-5 h-5 rounded-full bg-[#E8F1F7] text-[#4F7CAC] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="leading-relaxed">{pt}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Pro-Tip */}
      <div className="mt-4 pt-3 border-t border-[#DCE4EC] flex items-center gap-2 text-xs text-[#7A5B28] bg-[#F8F0E3] px-3.5 py-2.5 rounded-xl border border-[#EADCC8]">
        <Lightbulb className="w-4 h-4 shrink-0 text-[#C58B3A]" />
        <span>Listen carefully to Dr. Priya's explanation, or click <strong>"Ask Teacher"</strong> below anytime if you want clarification.</span>
      </div>
    </div>
  );
};
