import React, { useState } from 'react';
import { Droplets, Gauge, AlertCircle, Sparkles } from 'lucide-react';

interface WaterPipeAnalogyProps {
  pipeTightness?: number;
  pumpPressure?: number;
}

export const WaterPipeAnalogy: React.FC<WaterPipeAnalogyProps> = ({
  pipeTightness = 4,
  pumpPressure = 3
}) => {
  const [pressure, setPressure] = useState<number>(pumpPressure);
  const [tightness, setTightness] = useState<number>(pipeTightness);

  // Water flow calculation analogy
  const waterFlowRate = Number((pressure / Math.max(1, tightness) * 10).toFixed(1));

  return (
    <div id="water-pipe-analogy-visual" className="w-full h-full flex flex-col justify-between bg-white border border-[#DCE4EC] rounded-2xl p-5 text-[#17232D] shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#DCE4EC] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#4F7CAC] font-semibold">
              Intuitive Mental Model
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] font-semibold">
              Remediation Analogy
            </span>
          </div>
          <h3 className="text-base font-bold text-[#17232D] mt-0.5">
            The Water Pipe Analogy for Voltage, Current & Resistance
          </h3>
        </div>
      </div>

      {/* Hydraulic Graphic Simulation */}
      <div className="my-4 bg-[#F3F7FA] border border-[#DCE4EC] rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
        <svg viewBox="0 0 460 180" className="w-full h-44 max-w-lg select-none">
          {/* Main Wide Pipe */}
          <rect x="30" y="55" width="130" height="70" fill="#E8F1F7" stroke="#4F7CAC" strokeWidth="2.5" />
          
          {/* Constriction / Narrow Pipe (Resistance) */}
          <rect 
            x="160" 
            y={55 + tightness * 3.5} 
            width="120" 
            height={Math.max(12, 70 - tightness * 7)} 
            fill="#F8F0E3" 
            stroke="#C58B3A" 
            strokeWidth="2.5" 
          />

          {/* Post-constriction pipe */}
          <rect x="280" y="55" width="150" height="70" fill="#E8F1F7" stroke="#4F7CAC" strokeWidth="2.5" />

          {/* Water flow arrows */}
          <g fill="#4F7CAC">
            <path d="M 60 90 L 80 90 L 75 85 M 80 90 L 75 95" stroke="#4F7CAC" strokeWidth="3" fill="none" />
            <path d="M 100 90 L 120 90 L 115 85 M 120 90 L 115 95" stroke="#4F7CAC" strokeWidth="3" fill="none" />
            <path d="M 330 90 L 360 90 L 355 85 M 360 90 L 355 95" stroke="#4F7CAC" strokeWidth="3" fill="none" />
          </g>

          {/* Water Pump (Voltage) */}
          <g transform="translate(45, 90)">
            <circle cx="0" cy="0" r="20" fill="#ffffff" stroke="#B76565" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fill="#B76565" fontSize="10" fontWeight="bold">PUMP</text>
          </g>

          {/* Labels with lines */}
          <text x="50" y="35" fill="#B76565" fontSize="11" fontWeight="bold" textAnchor="middle">
            Pump Pressure = Voltage (V)
          </text>
          <text x="220" y="35" fill="#C58B3A" fontSize="11" fontWeight="bold" textAnchor="middle">
            Narrow Pipe = Resistance (R)
          </text>
          <text x="355" y="35" fill="#4F7CAC" fontSize="11" fontWeight="bold" textAnchor="middle">
            Water Flow = Current (I)
          </text>
        </svg>

        {/* Real-time calculated flow banner */}
        <div className="flex items-center gap-4 text-xs mt-2 bg-white px-4 py-1.5 rounded-lg border border-[#DCE4EC] shadow-xs">
          <div>
            <span className="text-[#61707C]">Pump Pressure: </span>
            <strong className="text-[#B76565] font-mono">{pressure} bar</strong>
          </div>
          <div className="text-[#DCE4EC]">|</div>
          <div>
            <span className="text-[#61707C]">Restriction: </span>
            <strong className="text-[#C58B3A] font-mono">Level {tightness}</strong>
          </div>
          <div className="text-[#DCE4EC]">|</div>
          <div>
            <span className="text-[#61707C]">Resulting Water Flow: </span>
            <strong className="text-[#4F7CAC] font-mono">{waterFlowRate} L/s</strong>
          </div>
        </div>
      </div>

      {/* Analogy explanation bullets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 my-2">
        <div className="p-3 bg-[#F7EAEA] border border-[#ECD1D1] rounded-xl text-xs space-y-1">
          <span className="font-bold text-[#B76565] block">1. Voltage = Pump Pressure</span>
          <p className="text-[#61707C]">The force pushing charge forward. More pressure = more flow.</p>
        </div>
        <div className="p-3 bg-[#F8F0E3] border border-[#EADCC8] rounded-xl text-xs space-y-1">
          <span className="font-bold text-[#C58B3A] block">2. Resistance = Pipe Narrowness</span>
          <p className="text-[#61707C]">The friction opposing flow. Thinner pipe = harder to pass.</p>
        </div>
        <div className="p-3 bg-[#EAF4EE] border border-[#D0E6D8] rounded-xl text-xs space-y-1">
          <span className="font-bold text-[#5B9A7A] block">3. Current = Flow Rate</span>
          <p className="text-[#61707C]">The actual amount of water/electrons passing per second.</p>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#DCE4EC]">
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-[#17232D]">Pump Pressure (Voltage):</span>
            <span className="font-mono text-[#B76565]">{pressure}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={pressure}
            onChange={(e) => setPressure(Number(e.target.value))}
            className="w-full h-1.5 bg-[#DCE4EC] rounded-lg appearance-none cursor-pointer accent-[#B76565]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-[#17232D]">Pipe Squeeze / Restriction (Resistance):</span>
            <span className="font-mono text-[#C58B3A]">{tightness}</span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            value={tightness}
            onChange={(e) => setTightness(Number(e.target.value))}
            className="w-full h-1.5 bg-[#DCE4EC] rounded-lg appearance-none cursor-pointer accent-[#C58B3A]"
          />
        </div>
      </div>
    </div>
  );
};
