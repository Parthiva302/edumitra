import React, { useState, useEffect } from 'react';
import { Zap, Play, Pause, RotateCcw, Activity } from 'lucide-react';

interface CircuitSimulatorProps {
  initialVoltage?: number;
  initialResistance?: number;
  onValuesChange?: (voltage: number, resistance: number, current: number) => void;
}

export const CircuitSimulator: React.FC<CircuitSimulatorProps> = ({
  initialVoltage = 12,
  initialResistance = 20,
  onValuesChange
}) => {
  const [voltage, setVoltage] = useState<number>(initialVoltage);
  const [resistance, setResistance] = useState<number>(initialResistance);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [electronOffset, setElectronOffset] = useState<number>(0);

  // Ohm's law: I = V / R
  const current = Number((voltage / resistance).toFixed(2));
  const power = Number((voltage * current).toFixed(2));

  useEffect(() => {
    if (onValuesChange) {
      onValuesChange(voltage, resistance, current);
    }
  }, [voltage, resistance, current, onValuesChange]);

  // Animate electron motion based on current magnitude
  useEffect(() => {
    if (!isPlaying) return;

    const speed = Math.max(0.2, current * 1.5);
    const interval = setInterval(() => {
      setElectronOffset(prev => (prev + speed) % 100);
    }, 40);

    return () => clearInterval(interval);
  }, [isPlaying, current]);

  const resetValues = () => {
    setVoltage(12);
    setResistance(20);
  };

  return (
    <div id="circuit-simulator" className="w-full h-full flex flex-col justify-between bg-white border border-[#DCE4EC] rounded-2xl p-5 text-[#17232D] shadow-xs">
      {/* Header bar with readouts */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE4EC] pb-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#4F7CAC] font-semibold">
            Interactive Physics Model
          </span>
          <h3 className="text-base font-bold text-[#17232D]">DC Circuit Simulation (Ohm's Law: I = V / R)</h3>
        </div>

        {/* Real-time calculated telemetry badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-[#F3F7FA] border border-[#DCE4EC] text-xs">
            <span className="text-[#61707C] mr-1">Current (I):</span>
            <strong className="text-[#4F7CAC] font-mono text-sm">{current} A</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#F3F7FA] border border-[#DCE4EC] text-xs hidden sm:block">
            <span className="text-[#61707C] mr-1">Power (P):</span>
            <strong className="text-[#17232D] font-mono text-sm">{power} W</strong>
          </div>
        </div>
      </div>

      {/* Interactive Circuit Schematic Display */}
      <div className="my-4 relative w-full h-56 bg-[#F3F7FA] border border-[#DCE4EC] rounded-xl flex items-center justify-center overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-subtle opacity-70" />

        {/* Circuit Diagram SVG */}
        <svg viewBox="0 0 440 200" className="w-full h-full max-w-md z-10 select-none">
          {/* Main rectangular wire path */}
          <rect
            x="50"
            y="30"
            width="340"
            height="140"
            fill="none"
            stroke="#61707C"
            strokeWidth="3.5"
            rx="8"
          />

          {/* Animated electron flow dashed line */}
          <rect
            x="50"
            y="30"
            width="340"
            height="140"
            fill="none"
            stroke="#4F7CAC"
            strokeWidth="3.5"
            strokeDasharray="8, 16"
            strokeDashoffset={-electronOffset * 3}
            rx="8"
          />

          {/* DC Voltage Source (Left side) */}
          <g transform="translate(50, 100)">
            <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#17232D" strokeWidth="2.5" />
            <text x="0" y="-3" textAnchor="middle" fill="#B76565" fontSize="13" fontWeight="bold">+</text>
            <text x="0" y="11" textAnchor="middle" fill="#4F7CAC" fontSize="13" fontWeight="bold">−</text>
            <text x="-32" y="4" textAnchor="end" fill="#17232D" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">
              {voltage}V
            </text>
          </g>

          {/* Resistor (Top side) */}
          <g transform="translate(220, 30)">
            <rect x="-35" y="-12" width="70" height="24" fill="#ffffff" stroke="#17232D" strokeWidth="2" rx="3" />
            {/* Resistor zigzag internal representation */}
            <path
              d="M -25 0 L -18 -7 L -8 7 L 2 -7 L 12 7 L 18 -7 L 25 0"
              fill="none"
              stroke="#C58B3A"
              strokeWidth="2"
            />
            <text x="0" y="-18" textAnchor="middle" fill="#17232D" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">
              {resistance} Ω
            </text>
          </g>

          {/* Light Bulb / Load (Bottom side) */}
          <g transform="translate(220, 170)">
            <circle 
              cx="0" 
              cy="0" 
              r="18" 
              fill={current > 0.1 ? `rgba(197, 139, 58, ${Math.min(1, current * 0.45 + 0.2)})` : '#ffffff'} 
              stroke="#17232D" 
              strokeWidth="2" 
            />
            {/* Filament X */}
            <line x1="-7" y1="-7" x2="7" y2="7" stroke="#17232D" strokeWidth="2" />
            <line x1="7" y1="-7" x2="-7" y2="7" stroke="#17232D" strokeWidth="2" />
            <text x="0" y="32" textAnchor="middle" fill="#61707C" fontSize="10" fontWeight="600">
              Load ({current} A)
            </text>
          </g>

          {/* Current Flow Direction Indicator Arrows */}
          <g transform="translate(130, 20)">
            <path d="M 0 0 L 12 5 L 0 10 Z" fill="#4F7CAC" />
            <text x="20" y="8" fill="#4F7CAC" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono">
              I →
            </text>
          </g>
        </svg>

        {/* Floating Quick Observation pill */}
        <div className="absolute bottom-2 left-2 z-20 bg-white/95 backdrop-blur-sm border border-[#DCE4EC] px-2.5 py-1 rounded-md text-[11px] text-[#61707C] font-medium shadow-xs">
          {voltage > 24 && resistance < 10 ? (
            <span className="text-[#B48645] font-semibold">⚠️ High current flow: Low resistance creates high heat</span>
          ) : resistance > 40 ? (
            <span className="text-[#61707C]">High resistance throttles current to a minimum</span>
          ) : (
            <span className="text-[#61707C]">Nominal steady current flow</span>
          )}
        </div>
      </div>

      {/* Interactive Controls & Sliders */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Voltage Slider */}
          <div className="bg-[#F3F7FA] border border-[#DCE4EC] rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <label htmlFor="voltage-slider" className="text-[#17232D]">Voltage Source (V):</label>
              <span className="font-mono text-[#B76565] font-bold">{voltage} Volts</span>
            </div>
            <input
              id="voltage-slider"
              type="range"
              min="1"
              max="48"
              step="1"
              value={voltage}
              onChange={(e) => setVoltage(Number(e.target.value))}
              className="w-full h-1.5 bg-[#DCE4EC] rounded-lg appearance-none cursor-pointer accent-[#4F7CAC]"
            />
            <div className="flex justify-between text-[10px] text-[#8D9AA6] font-mono">
              <span>1V (Low push)</span>
              <span>48V (High push)</span>
            </div>
          </div>

          {/* Resistance Slider */}
          <div className="bg-[#F3F7FA] border border-[#DCE4EC] rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <label htmlFor="resistance-slider" className="text-[#17232D]">Circuit Resistance (R):</label>
              <span className="font-mono text-[#C58B3A] font-bold">{resistance} Ohms</span>
            </div>
            <input
              id="resistance-slider"
              type="range"
              min="2"
              max="60"
              step="1"
              value={resistance}
              onChange={(e) => setResistance(Number(e.target.value))}
              className="w-full h-1.5 bg-[#DCE4EC] rounded-lg appearance-none cursor-pointer accent-[#C58B3A]"
            />
            <div className="flex justify-between text-[10px] text-[#8D9AA6] font-mono">
              <span>2Ω (Easy flow)</span>
              <span>60Ω (Tight restriction)</span>
            </div>
          </div>
        </div>

        {/* Bottom Play/Pause/Reset Toolbar */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F3F7FA] hover:bg-[#E8F1F7] text-[#17232D] border border-[#DCE4EC] font-medium transition cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause Animation' : 'Resume Flow'}</span>
            </button>
            <button
              onClick={resetValues}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F3F7FA] hover:bg-[#E8F1F7] text-[#17232D] border border-[#DCE4EC] font-medium transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Values</span>
            </button>
          </div>

          <div className="text-[11px] text-[#61707C] font-mono hidden md:block">
            Formula: <span className="text-[#17232D] font-bold">{current}A = {voltage}V / {resistance}Ω</span>
          </div>
        </div>
      </div>
    </div>
  );
};
