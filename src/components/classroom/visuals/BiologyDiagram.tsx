import React, { useState } from 'react';
import { Sun, Droplets, Wind, Sparkles, Dna, Activity } from 'lucide-react';

interface StructureItem {
  name: string;
  function: string;
  color: string;
}

interface BiologyDiagramProps {
  title?: string;
  diagramType?: string;
  keyStructures?: StructureItem[];
  equation?: string;
  className?: string;
}

export const BiologyDiagram: React.FC<BiologyDiagramProps> = ({
  title = "Photosynthesis & Cellular Chloroplast Mechanism",
  diagramType = "photosynthesis_cycle",
  keyStructures = [
    { name: "Thylakoid Membrane", function: "Light-dependent ATP and NADPH synthesis", color: "#5B9A7A" },
    { name: "Stroma (Liquid Matrix)", function: "Light-independent Calvin cycle & carbon fixation", color: "#4F7CAC" },
    { name: "CO2 + H2O Inputs", function: "Raw reactants driven by photon energy", color: "#C58B3A" },
    { name: "Glucose (C6H12O6) Output", function: "Synthesized high-energy carbohydrate", color: "#8D9AA6" }
  ],
  equation = "6CO_2 + 6H_2O + \\text{Photons} \\xrightarrow{} C_6H_{12}O_6 + 6O_2",
  className = ''
}) => {
  const [activeStructure, setActiveStructure] = useState<number>(0);
  const [isLightActive, setIsLightActive] = useState<boolean>(true);

  return (
    <div className={`flex flex-col h-full bg-white border border-[#DCE4EC] rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#DCE4EC] bg-[#F5F7F8]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#5B9A7A] animate-pulse" />
          <span className="text-xs font-semibold text-[#17232D] tracking-tight">{title}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EAF4EE] text-[#5B9A7A] font-mono border border-[#D0E6D8]">
            Bioscience
          </span>
        </div>
        <button
          onClick={() => setIsLightActive(!isLightActive)}
          className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center gap-1 transition-all cursor-pointer ${
            isLightActive
              ? 'bg-[#F8F0E3] text-[#C58B3A] border-[#EADCC8]'
              : 'bg-[#F3F7FA] text-[#8D9AA6] border-[#DCE4EC]'
          }`}
        >
          <Sun className="w-3 h-3" />
          <span>{isLightActive ? 'Photons Active' : 'Dark Mode'}</span>
        </button>
      </div>

      {/* Main Biology Visual Stage */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch bg-radial from-[#F5F7F8] to-[#E8EFF5]">
        {/* Chloroplast / Biological Pathway Model (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-lg border border-[#DCE4EC] p-3 flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div className="relative w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-[#EAF4EE] via-[#E8F1F7] to-[#F3F7FA] border border-[#D0E6D8] p-3 flex items-center justify-center">
            {/* Chloroplast Organelle Membrane Boundary */}
            <div className="relative w-full h-full rounded-2xl border-2 border-[#5B9A7A]/40 bg-white/70 backdrop-blur-xs flex items-center justify-between p-4 shadow-sm">
              {/* Light Reactions Zone (Thylakoids) */}
              <div 
                onClick={() => setActiveStructure(0)}
                className={`w-[45%] h-full rounded-xl border p-2 flex flex-col justify-between transition-all cursor-pointer ${
                  activeStructure === 0 
                    ? 'bg-[#EAF4EE] border-[#5B9A7A] ring-2 ring-[#D0E6D8] shadow-sm' 
                    : 'bg-white/80 border-[#DCE4EC] hover:bg-[#EAF4EE]/50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Sun className={`w-3.5 h-3.5 ${isLightActive ? 'text-[#C58B3A] animate-spin' : 'text-[#8D9AA6]'}`} />
                  <span className="text-[10px] font-bold text-[#17232D]">Light Reactions</span>
                </div>

                {/* Thylakoid Stacks (Grana) */}
                <div className="flex flex-col gap-1 items-center my-auto">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-16 h-2.5 rounded-full bg-[#5B9A7A] shadow-xs flex items-center justify-center">
                      <span className="text-[7px] text-white font-mono font-bold">Thylakoid</span>
                    </div>
                  ))}
                </div>

                <div className="text-[9px] text-[#5B9A7A] font-mono flex items-center justify-between border-t border-[#D0E6D8] pt-1">
                  <span>H₂O → O₂</span>
                  <span className="font-bold">ATP + NADPH</span>
                </div>
              </div>

              {/* Energy Transfer Bridge */}
              <div className="flex flex-col items-center justify-center gap-1 text-[8px] font-mono text-[#4F7CAC] font-bold">
                <span className="animate-pulse">→ ATP →</span>
                <span className="text-[#8D9AA6]">← ADP ←</span>
              </div>

              {/* Calvin Cycle Zone (Stroma) */}
              <div 
                onClick={() => setActiveStructure(1)}
                className={`w-[45%] h-full rounded-xl border p-2 flex flex-col justify-between transition-all cursor-pointer ${
                  activeStructure === 1 
                    ? 'bg-[#E8F1F7] border-[#4F7CAC] ring-2 ring-[#D0E1EE] shadow-sm' 
                    : 'bg-white/80 border-[#DCE4EC] hover:bg-[#E8F1F7]/50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#4F7CAC]" />
                  <span className="text-[10px] font-bold text-[#17232D]">Calvin Cycle</span>
                </div>

                {/* Circular Cycle Graphic */}
                <div className="relative w-14 h-14 rounded-full border-2 border-dashed border-[#4F7CAC] my-auto mx-auto flex items-center justify-center animate-spin" style={{ animationDuration: '18s' }}>
                  <span className="text-[8px] font-bold text-[#4F7CAC] font-mono">RuBisCO</span>
                </div>

                <div className="text-[9px] text-[#4F7CAC] font-mono flex items-center justify-between border-t border-[#D0E1EE] pt-1">
                  <span>CO₂ In</span>
                  <span className="font-bold text-[#5B9A7A]">C₆H₁₂O₆ Out</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chemical Formula Strip */}
          <div className="mt-2 p-2 bg-[#F3F7FA] rounded border border-[#DCE4EC] flex items-center justify-center text-center">
            <span className="text-[11px] font-mono text-[#17232D] font-bold">
              6CO₂ + 6H₂O + Light Energy ➔ C₆H₁₂O₆ + 6O₂
            </span>
          </div>
        </div>

        {/* Structure Breakdown Info (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-medium text-[#61707C]">Key Biological Structures:</span>
          <div className="space-y-1.5 flex-1 overflow-y-auto">
            {keyStructures.map((st, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStructure(idx)}
                className={`p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                  activeStructure === idx
                    ? 'bg-[#EAF4EE] border-[#5B9A7A] shadow-xs'
                    : 'bg-white border-[#DCE4EC] hover:border-[#CBD6E2]'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-[#17232D] text-[11px]">{st.name}</span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                </div>
                <p className="text-[11px] text-[#61707C] leading-relaxed">{st.function}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
