import React, { useState } from 'react';
import { Play, RotateCcw, Terminal, Code2, Check, ArrowRight } from 'lucide-react';

interface ExecutionStep {
  line: number;
  explanation: string;
}

interface CodeRunnerVisualProps {
  language?: string;
  title?: string;
  code?: string;
  executionSteps?: ExecutionStep[];
  consoleOutput?: string;
  className?: string;
}

export const CodeRunnerVisual: React.FC<CodeRunnerVisualProps> = ({
  language = "python",
  title = "Recursive Function & Call Stack Execution",
  code = `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Main call
result = factorial(4)
print(f"Result: {result}")`,
  executionSteps = [
    { line: 1, explanation: "Define factorial function with base case n <= 1" },
    { line: 7, explanation: "Invoke factorial(4) -> Stack frame pushed" },
    { line: 4, explanation: "4 * factorial(3) -> Stack frame pushed" },
    { line: 4, explanation: "3 * factorial(2) -> Stack frame pushed" },
    { line: 4, explanation: "2 * factorial(1) -> Stack frame pushed" },
    { line: 3, explanation: "Base case reached: factorial(1) returns 1" },
    { line: 4, explanation: "Unwinding stack: 2*1=2, 3*2=6, 4*6=24" },
    { line: 8, explanation: "Final output printed to console: Result: 24" }
  ],
  consoleOutput = "Result: 24",
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [userEditedCode, setUserEditedCode] = useState<string>(code);

  const activeLine = executionSteps[currentStep]?.line || 1;

  const handleNextStep = () => {
    if (currentStep < executionSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsRunning(false);
  };

  return (
    <div className={`flex flex-col h-full bg-white border border-[#DCE4EC] rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#DCE4EC] bg-[#F5F7F8]">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#4F7CAC]" />
          <span className="text-xs font-semibold text-[#17232D] tracking-tight">{title}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E8F1F7] text-[#4F7CAC] font-mono border border-[#D0E1EE] uppercase">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-1 rounded text-[#8D9AA6] hover:text-[#17232D] hover:bg-white transition-colors cursor-pointer"
            title="Reset Execution"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNextStep}
            disabled={currentStep >= executionSteps.length - 1}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
              currentStep < executionSteps.length - 1
                ? 'bg-[#4F7CAC] hover:bg-[#3D6692] text-white shadow-xs'
                : 'bg-[#F3F7FA] text-[#8D9AA6] border border-[#DCE4EC] cursor-not-allowed'
            }`}
          >
            <span>Step {currentStep + 1}/{executionSteps.length}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Code & Call Stack Split Stage */}
      <div className="flex-1 p-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch bg-[#1E293B] text-slate-100 font-mono text-xs overflow-hidden">
        {/* Code Editor Frame with Live Line Highlighter (7 cols) */}
        <div className="md:col-span-7 bg-[#0F172A] rounded-lg p-3 border border-slate-700 flex flex-col justify-between overflow-x-auto">
          <div className="space-y-1">
            {userEditedCode.split('\n').map((lineText, idx) => {
              const lineNum = idx + 1;
              const isHighlight = lineNum === activeLine;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 px-2 py-0.5 rounded transition-colors ${
                    isHighlight ? 'bg-[#334155] border-l-2 border-[#38BDF8] text-white' : 'text-slate-400'
                  }`}
                >
                  <span className="text-[10px] w-4 text-right text-slate-600 select-none">{lineNum}</span>
                  <span className={isHighlight ? 'text-[#38BDF8] font-bold' : ''}>{lineText}</span>
                </div>
              );
            })}
          </div>

          {/* Current Step Intuition Banner */}
          <div className="mt-3 p-2 rounded bg-[#1E293B] border border-slate-700 text-[11px] text-[#38BDF8] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
            <span>{executionSteps[currentStep]?.explanation}</span>
          </div>
        </div>

        {/* Stack & Output Frame (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between gap-2">
          {/* Call Stack Simulation */}
          <div className="bg-[#0F172A] rounded-lg p-3 border border-slate-700 flex-1 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-sans font-medium uppercase tracking-wider block mb-2">
              Call Stack Memory:
            </span>
            <div className="flex flex-col-reverse gap-1.5 flex-1 justify-end">
              {Array.from({ length: Math.min(4, currentStep + 1) }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1E293B] border border-[#38BDF8]/40 p-1.5 rounded text-[10px] text-slate-200 flex justify-between items-center shadow-xs"
                >
                  <span>factorial(n = {4 - i})</span>
                  <span className="text-[8px] px-1 py-0.2 bg-[#38BDF8]/20 text-[#38BDF8] rounded">Stack Frame</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Terminal Output */}
          <div className="bg-[#0F172A] rounded-lg p-2.5 border border-slate-700">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-sans mb-1">
              <Terminal className="w-3 h-3 text-[#34D399]" />
              <span>Console Output:</span>
            </div>
            <div className="p-1.5 bg-black/40 rounded text-[#34D399] text-[11px] font-mono">
              {currentStep >= executionSteps.length - 1 ? consoleOutput : "..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
