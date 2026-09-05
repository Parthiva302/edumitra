import React, { useState } from 'react';
import { Play, RotateCcw, Activity, ArrowRight } from 'lucide-react';

interface ForceVector {
  name: string;
  magnitude: number;
  direction: number; // in degrees
  color: string;
}

interface PhysicsSimulatorProps {
  initialMass?: number;
  initialForce?: number;
  forces?: ForceVector[];
  concept?: string;
  className?: string;
}

export const PhysicsSimulator: React.FC<PhysicsSimulatorProps> = ({
  initialMass = 5,
  initialForce = 25,
  forces: propForces,
  concept = "Newton's Second Law (F = ma)",
  className = ''
}) => {
  const [mass, setMass] = useState<number>(initialMass);
  const [appliedForce, setAppliedForce] = useState<number>(initialForce);
  const [frictionCoeff, setFrictionCoeff] = useState<number>(0.2);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [boxPosition, setBoxPosition] = useState<number>(20);

  const gravity = 9.8;
  const normalForce = Math.round(mass * gravity);
  const frictionForce = Math.round(normalForce * frictionCoeff);
  const netForce = Math.max(0, appliedForce - frictionForce);
  const acceleration = Number((netForce / mass).toFixed(2));

  const handleReset = () => {
    setMass(5);
    setAppliedForce(25);
    setFrictionCoeff(0.2);
    setBoxPosition(20);
  };

  return (
    <div className={`flex flex-col h-full bg-white border border-[#DCE4EC] rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Visual Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#DCE4EC] bg-[#F5F7F8]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4F7CAC] animate-pulse" />
          <span className="text-xs font-semibold text-[#17232D] tracking-tight">
            {concept}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E8F1F7] text-[#4F7CAC] font-mono border border-[#D0E1EE]">
            Dynamic Simulation
          </span>
        </div>
        <button
          onClick={handleReset}
          className="p-1 rounded text-[#8D9AA6] hover:text-[#17232D] hover:bg-white transition-colors cursor-pointer"
          title="Reset Values"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Canvas Area */}
      <div className="flex-1 relative bg-radial from-[#F5F7F8] to-[#E8EFF5] p-4 flex flex-col justify-between min-h-[220px]">
        {/* Live Vector Free-Body Stage */}
        <div className="relative w-full flex-1 flex items-center justify-center">
          {/* Surface Ground Line */}
          <div className="absolute bottom-6 left-4 right-4 h-1.5 bg-[#CBD6E2] rounded-full">
            <div className="absolute top-1.5 left-0 right-0 h-2 flex justify-between overflow-hidden opacity-40">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className="w-2 h-2 border-r border-[#8D9AA6] transform -skew-x-45" />
              ))}
            </div>
          </div>

          {/* Mass Block */}
          <div 
            className="relative w-28 h-24 rounded-lg bg-gradient-to-br from-[#4F7CAC] to-[#35587E] text-white flex flex-col items-center justify-center shadow-md transition-all duration-300 z-10"
            style={{ marginBottom: '14px' }}
          >
            <span className="text-xs font-mono font-bold tracking-tight">m = {mass} kg</span>
            <span className="text-[10px] opacity-80">Rigid Body</span>

            {/* Force Arrow: Applied Force (Right) */}
            <div 
              className="absolute left-full top-1/2 -translate-y-1/2 flex items-center gap-1 pl-2 transition-all duration-300"
              style={{ width: `${Math.min(140, appliedForce * 2.5)}px` }}
            >
              <div className="h-1 bg-[#5B9A7A] flex-1 rounded-full relative">
                <div className="absolute right-0 -top-1 border-solid border-l-[#5B9A7A] border-l-6 border-y-transparent border-y-4 border-r-0" />
              </div>
              <span className="text-[10px] font-mono text-[#5B9A7A] font-bold whitespace-nowrap bg-white/90 px-1 rounded shadow-xs">
                F_app = {appliedForce}N
              </span>
            </div>

            {/* Force Arrow: Friction (Left) */}
            <div 
              className="absolute right-full top-1/2 -translate-y-1/2 flex items-center flex-row-reverse gap-1 pr-2 transition-all duration-300"
              style={{ width: `${Math.min(100, frictionForce * 2.5)}px` }}
            >
              <div className="h-1 bg-[#B76565] flex-1 rounded-full relative">
                <div className="absolute left-0 -top-1 border-solid border-r-[#B76565] border-r-6 border-y-transparent border-y-4 border-l-0" />
              </div>
              <span className="text-[10px] font-mono text-[#B76565] font-bold whitespace-nowrap bg-white/90 px-1 rounded shadow-xs">
                f_k = {frictionForce}N
              </span>
            </div>

            {/* Normal Force (Up) */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 flex flex-col items-center pb-1">
              <span className="text-[10px] font-mono text-[#4F7CAC] font-bold bg-white/90 px-1 rounded shadow-xs mb-0.5">
                N = {normalForce}N
              </span>
              <div className="w-1 h-8 bg-[#4F7CAC] rounded-full relative">
                <div className="absolute top-0 -left-1 border-solid border-b-[#4F7CAC] border-b-6 border-x-transparent border-x-4 border-t-0" />
              </div>
            </div>

            {/* Gravity Force (Down) */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 flex flex-col items-center pt-1">
              <div className="w-1 h-8 bg-[#C58B3A] rounded-full relative">
                <div className="absolute bottom-0 -left-1 border-solid border-t-[#C58B3A] border-t-6 border-x-transparent border-x-4 border-b-0" />
              </div>
              <span className="text-[10px] font-mono text-[#C58B3A] font-bold bg-white/90 px-1 rounded shadow-xs mt-0.5">
                W = mg = {normalForce}N
              </span>
            </div>
          </div>
        </div>

        {/* Live Kinematic Metrics Pill */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="bg-white/95 p-2 rounded-md border border-[#DCE4EC] text-center shadow-xs">
            <span className="text-[10px] text-[#61707C] block font-medium">Net Force (F_net)</span>
            <span className="text-xs font-mono font-bold text-[#17232D]">{netForce} N</span>
          </div>
          <div className="bg-[#EAF4EE] p-2 rounded-md border border-[#D0E6D8] text-center shadow-xs">
            <span className="text-[10px] text-[#5B9A7A] block font-medium">Acceleration (a = F/m)</span>
            <span className="text-xs font-mono font-bold text-[#5B9A7A]">{acceleration} m/s²</span>
          </div>
          <div className="bg-[#E8F1F7] p-2 rounded-md border border-[#D0E1EE] text-center shadow-xs">
            <span className="text-[10px] text-[#4F7CAC] block font-medium">Equilibrium State</span>
            <span className="text-xs font-mono font-bold text-[#4F7CAC]">
              {netForce === 0 ? "Static Rest" : "Accelerating"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Controls */}
      <div className="p-3 bg-[#F5F7F8] border-t border-[#DCE4EC] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <div className="flex justify-between mb-1 text-[11px] text-[#61707C]">
            <span>Applied Force (F_app):</span>
            <span className="font-mono font-bold text-[#17232D]">{appliedForce} N</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="1"
            value={appliedForce}
            onChange={(e) => setAppliedForce(Number(e.target.value))}
            className="w-full h-1.5 bg-[#CBD6E2] rounded-lg appearance-none cursor-pointer accent-[#4F7CAC]"
          />
        </div>
        <div>
          <div className="flex justify-between mb-1 text-[11px] text-[#61707C]">
            <span>Mass (m):</span>
            <span className="font-mono font-bold text-[#17232D]">{mass} kg</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
            className="w-full h-1.5 bg-[#CBD6E2] rounded-lg appearance-none cursor-pointer accent-[#4F7CAC]"
          />
        </div>
      </div>
    </div>
  );
};
