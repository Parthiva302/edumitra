import React, { useState } from 'react';
import { Atom, Flame, Activity, Sparkles } from 'lucide-react';

interface MoleculeItem {
  name: string;
  atoms: string[];
  color: string;
}

interface ChemistryVisualProps {
  title?: string;
  reactants?: string[];
  products?: string[];
  enthalpy?: string;
  bonding?: string;
  molecules?: MoleculeItem[];
  className?: string;
}

export const ChemistryVisual: React.FC<ChemistryVisualProps> = ({
  title = "Molecular Reaction & Exothermic Bond Formation",
  reactants = ["2H₂ (g)", "O₂ (g)"],
  products = ["2H₂O (l)"],
  enthalpy = "ΔH = -572 kJ/mol (Exothermic)",
  bonding = "Polar covalent O-H bonds with 104.5° bent geometry",
  molecules = [
    { name: "Hydrogen (2H₂)", atoms: ["H", "H", "H", "H"], color: "#4F7CAC" },
    { name: "Oxygen (O₂)", atoms: ["O", "O"], color: "#B76565" },
    { name: "Water (2H₂O)", atoms: ["H", "O", "H"], color: "#5B9A7A" }
  ],
  className = ''
}) => {
  const [reactionStage, setReactionStage] = useState<'reactants' | 'transition' | 'products'>('products');

  return (
    <div className={`flex flex-col h-full bg-white border border-[#DCE4EC] rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#DCE4EC] bg-[#F5F7F8]">
        <div className="flex items-center gap-2">
          <Atom className="w-4 h-4 text-[#B76565]" />
          <span className="text-xs font-semibold text-[#17232D] tracking-tight">{title}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F7EAEA] text-[#B76565] font-mono border border-[#ECD1D1]">
            Chemistry
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setReactionStage('reactants')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all cursor-pointer ${
              reactionStage === 'reactants' ? 'bg-[#E8F1F7] text-[#4F7CAC] border-[#D0E1EE] font-bold' : 'bg-white text-[#61707C] border-[#DCE4EC]'
            }`}
          >
            Reactants
          </button>
          <button
            onClick={() => setReactionStage('transition')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all cursor-pointer ${
              reactionStage === 'transition' ? 'bg-[#F8F0E3] text-[#C58B3A] border-[#EADCC8] font-bold' : 'bg-white text-[#61707C] border-[#DCE4EC]'
            }`}
          >
            Transition
          </button>
          <button
            onClick={() => setReactionStage('products')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all cursor-pointer ${
              reactionStage === 'products' ? 'bg-[#EAF4EE] text-[#5B9A7A] border-[#D0E6D8] font-bold' : 'bg-white text-[#61707C] border-[#DCE4EC]'
            }`}
          >
            Products
          </button>
        </div>
      </div>

      {/* Main Chemistry Reaction Canvas */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch bg-radial from-[#F5F7F8] to-[#E8EFF5]">
        {/* Molecular Stage Canvas (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-lg border border-[#DCE4EC] p-4 flex flex-col justify-between shadow-xs">
          <div className="flex-1 relative flex items-center justify-center min-h-[160px] bg-[#F8FAFC] rounded-lg border border-[#E8EFF5] p-3">
            {reactionStage === 'reactants' && (
              <div className="flex items-center justify-around w-full">
                {/* 2 H2 molecules */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-1">
                    <span className="w-7 h-7 rounded-full bg-[#4F7CAC] text-white text-xs font-bold flex items-center justify-center shadow-xs">H</span>
                    <span className="w-7 h-7 rounded-full bg-[#4F7CAC] text-white text-xs font-bold flex items-center justify-center shadow-xs">H</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#61707C]">2H₂ Gas</span>
                </div>
                <span className="text-lg font-bold text-[#8D9AA6]">+</span>
                {/* 1 O2 molecule */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-1">
                    <span className="w-9 h-9 rounded-full bg-[#B76565] text-white text-xs font-bold flex items-center justify-center shadow-xs">O</span>
                    <span className="w-9 h-9 rounded-full bg-[#B76565] text-white text-xs font-bold flex items-center justify-center shadow-xs">O</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#61707C]">O₂ Gas</span>
                </div>
              </div>
            )}

            {reactionStage === 'transition' && (
              <div className="flex flex-col items-center justify-center gap-2">
                <Flame className="w-8 h-8 text-[#C58B3A] animate-bounce" />
                <span className="text-xs font-bold text-[#C58B3A] font-mono animate-pulse">
                  Activated Complex [H···O···H]‡
                </span>
                <span className="text-[10px] text-[#61707C]">Bonds breaking & reforming at activation energy</span>
              </div>
            )}

            {reactionStage === 'products' && (
              <div className="flex items-center justify-around w-full">
                {/* 2 H2O molecules */}
                {[1, 2].map(i => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="relative w-20 h-16 flex items-center justify-center">
                      <span className="w-10 h-10 rounded-full bg-[#5B9A7A] text-white text-xs font-bold flex items-center justify-center shadow-xs z-10">O</span>
                      <span className="w-6 h-6 rounded-full bg-[#4F7CAC] text-white text-[10px] font-bold flex items-center justify-center absolute -top-1 -left-1 shadow-xs">H</span>
                      <span className="w-6 h-6 rounded-full bg-[#4F7CAC] text-white text-[10px] font-bold flex items-center justify-center absolute -top-1 -right-1 shadow-xs">H</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#5B9A7A] font-bold">H₂O Molecule #{i}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Balanced Chemical Equation */}
          <div className="mt-3 p-2 bg-[#F3F7FA] rounded border border-[#DCE4EC] flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-[#17232D]">2H₂ (g) + O₂ (g) ➔ 2H₂O (l)</span>
            <span className="text-[11px] font-mono text-[#B76565] font-semibold">{enthalpy}</span>
          </div>
        </div>

        {/* Bonding & Molecular Structure Info (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-medium text-[#61707C]">Chemical Characteristics:</span>
          <div className="space-y-2 flex-1">
            <div className="p-3 bg-white rounded-lg border border-[#DCE4EC] shadow-xs">
              <span className="text-[10px] font-medium text-[#61707C] block mb-0.5">Bonding & Geometry</span>
              <p className="text-xs text-[#17232D] leading-relaxed">{bonding}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#DCE4EC] shadow-xs">
              <span className="text-[10px] font-medium text-[#61707C] block mb-0.5">Thermodynamic State</span>
              <p className="text-xs text-[#5B9A7A] font-bold">Exothermic Release (ΔH &lt; 0)</p>
              <p className="text-[11px] text-[#61707C] mt-0.5">Energy is released as strong covalent bonds form.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
