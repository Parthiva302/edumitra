import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle2, MapPin, ChevronRight } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface HistoryTimelineVisualProps {
  title?: string;
  events?: TimelineEvent[];
  className?: string;
}

export const HistoryTimelineVisual: React.FC<HistoryTimelineVisualProps> = ({
  title = "Chronological Progression & Historical Causality",
  events = [
    { year: "Phase 1", title: "Foundational Conditions", description: "Socio-economic catalysts and structural precursors leading up to transformation." },
    { year: "Phase 2", title: "The Critical Turning Point", description: "Decisive event triggering widespread institutional and scientific reform." },
    { year: "Phase 3", title: "Systemic Evolution", description: "Consolidation of new methodologies and operational frameworks." },
    { year: "Phase 4", title: "Enduring Legacy", description: "Long-term paradigm shift and modern theoretical foundation." }
  ],
  className = ''
}) => {
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);

  return (
    <div className={`flex flex-col h-full bg-white border border-[#DCE4EC] rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#DCE4EC] bg-[#F5F7F8]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#C58B3A]" />
          <span className="text-xs font-semibold text-[#17232D] tracking-tight">{title}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F8F0E3] text-[#C58B3A] font-mono border border-[#EADCC8]">
            Timeline & Context
          </span>
        </div>
        <span className="text-[11px] text-[#61707C]">Interactive Milestones</span>
      </div>

      {/* Main Timeline Stage */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch bg-radial from-[#F5F7F8] to-[#E8EFF5]">
        {/* Horizontal & Vertical Timeline Line (6 cols) */}
        <div className="md:col-span-6 bg-white rounded-lg border border-[#DCE4EC] p-3 flex flex-col justify-between shadow-xs">
          <span className="text-[11px] font-medium text-[#61707C] mb-2 block">Progression Sequence:</span>
          <div className="relative pl-6 space-y-4 border-l-2 border-[#DCE4EC] my-auto">
            {events.map((ev, idx) => {
              const isSelected = selectedEventIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedEventIndex(idx)}
                  className={`relative p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F8F0E3] border-[#C58B3A] shadow-xs translate-x-1'
                      : 'bg-white border-[#DCE4EC] hover:border-[#CBD6E2]'
                  }`}
                >
                  {/* Timeline Dot Indicator */}
                  <div 
                    className={`absolute -left-[31px] top-3.5 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      isSelected 
                        ? 'bg-[#C58B3A] border-white ring-2 ring-[#C58B3A]/40' 
                        : 'bg-white border-[#CBD6E2]'
                    }`}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#C58B3A]">{ev.year}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#C58B3A]" />}
                  </div>
                  <h4 className="text-xs font-bold text-[#17232D] mt-0.5">{ev.title}</h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Detail Card (6 cols) */}
        <div className="md:col-span-6 bg-white rounded-lg border border-[#DCE4EC] p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F8F0E3] text-[#C58B3A] text-[10px] font-mono font-bold mb-2">
              <Calendar className="w-3 h-3" />
              <span>{events[selectedEventIndex]?.year}</span>
            </div>
            <h3 className="text-sm font-bold text-[#17232D] tracking-tight mb-2">
              {events[selectedEventIndex]?.title}
            </h3>
            <p className="text-xs text-[#61707C] leading-relaxed">
              {events[selectedEventIndex]?.description}
            </p>
          </div>

          <div className="mt-4 p-2.5 bg-[#F3F7FA] rounded border border-[#DCE4EC] text-[11px] text-[#61707C] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4F7CAC]" />
            <span>Pedagogical Context: Examine the direct cause-and-effect link.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
