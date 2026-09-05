import React, { useState, useEffect } from 'react';
import { LearningPath, LearningPathNode } from '../../types';
import { DEMO_LEARNING_PATH } from '../../data/mockData';
import { 
  CheckCircle2, 
  Play, 
  Lock, 
  ArrowRight
} from 'lucide-react';

interface LearningPathPageProps {
  path?: LearningPath;
  onStartLesson: (topic: string) => void;
}

export const LearningPathPage: React.FC<LearningPathPageProps> = ({
  path: initialPath = DEMO_LEARNING_PATH,
  onStartLesson
}) => {
  const [nodes, setNodes] = useState<LearningPathNode[]>(initialPath.nodes);
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    if (initialPath && initialPath.nodes) {
      setNodes(initialPath.nodes);
    }
  }, [initialPath]);

  const toggleNodeCompletion = (nodeId: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        const nextStatus = n.status === 'completed' ? 'in_progress' : 'completed';
        return { ...n, status: nextStatus };
      }
      return n;
    }));
  };

  const filteredNodes = nodes.filter(node => {
    if (activeFilter === 'all') return true;
    return node.status === activeFilter;
  });

  const completedCount = nodes.filter(n => n.status === 'completed').length;
  const totalCount = nodes.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div id="learning-path-roadmap" className="space-y-6 md:space-y-8 font-sans max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 md:p-8 space-y-4 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#61707C]">
            Structured Curriculum
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-[#F3F7FA] text-[#17232D] font-medium border border-[#DCE4EC]">
            {initialPath.category}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#17232D] tracking-tight">{initialPath.title}</h1>
            <p className="text-xs md:text-sm text-[#61707C] mt-1 max-w-2xl">{initialPath.description}</p>
          </div>

          <div className="bg-[#F3F7FA] border border-[#DCE4EC] rounded-lg p-4 min-w-[200px] space-y-2 shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#61707C]">Track Progress</span>
              <span className="text-[#4F7CAC] font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#DCE4EC] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4F7CAC] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-[#61707C] block text-right font-mono">
              {completedCount} of {totalCount} Milestones
            </span>
          </div>
        </div>
      </div>

      {/* Visual Step-by-Step Node Tree */}
      <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 md:p-8 space-y-6 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#DCE4EC] pb-3 gap-3">
          <div>
            <h2 className="font-semibold text-[#17232D] text-sm">Curriculum Milestones</h2>
            <p className="text-xs text-[#61707C]">Pedagogical Sequence & Self-Paced Progression</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#F3F7FA] p-1 rounded-lg border border-[#DCE4EC] shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all duration-150 cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-[#17232D] shadow-[0_1px_2px_rgba(23,35,45,0.04)] font-semibold border border-[#DCE4EC]'
                  : 'text-[#61707C] hover:text-[#17232D]'
              }`}
            >
              All ({nodes.length})
            </button>
            <button
              onClick={() => setActiveFilter('in_progress')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all duration-150 cursor-pointer ${
                activeFilter === 'in_progress'
                  ? 'bg-white text-[#4F7CAC] shadow-[0_1px_2px_rgba(23,35,45,0.04)] font-semibold border border-[#DCE4EC]'
                  : 'text-[#61707C] hover:text-[#17232D]'
              }`}
            >
              In Progress ({nodes.filter(n => n.status === 'in_progress').length})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all duration-150 cursor-pointer ${
                activeFilter === 'completed'
                  ? 'bg-white text-[#5B9A7A] shadow-[0_1px_2px_rgba(23,35,45,0.04)] font-semibold border border-[#DCE4EC]'
                  : 'text-[#61707C] hover:text-[#17232D]'
              }`}
            >
              Mastered ({nodes.filter(n => n.status === 'completed').length})
            </button>
          </div>
        </div>

        <div className="relative border-l border-[#DCE4EC] ml-4 md:ml-6 space-y-6 pl-6 md:pl-8 py-2">
          {filteredNodes.map((node, idx) => {
            const isCompleted = node.status === 'completed';
            const isCurrent = node.status === 'in_progress';
            const isLocked = node.status === 'locked';

            return (
              <div key={node.id} className="relative group">
                {/* Node Milestone Icon */}
                <button
                  type="button"
                  onClick={() => !isLocked && toggleNodeCompletion(node.id)}
                  title={isLocked ? "Prerequisites required" : "Click to toggle milestone completion"}
                  className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border text-xs transition-all duration-150 ${
                    isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                  } ${
                    isCompleted
                      ? 'bg-[#5B9A7A] border-[#5B9A7A] text-white shadow-[0_1px_2px_rgba(91,154,122,0.2)]'
                      : isCurrent
                      ? 'bg-[#4F7CAC] border-[#4F7CAC] text-white shadow-[0_1px_2px_rgba(79,124,172,0.2)]'
                      : 'bg-[#F3F7FA] border-[#DCE4EC] text-[#8D9AA6]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  ) : (
                    <Lock className="w-3 h-3" />
                  )}
                </button>

                {/* Milestone Details Card */}
                <div
                  className={`p-4 md:p-5 rounded-lg border transition-all duration-150 ${
                    isCurrent
                      ? 'bg-[#F3F7FA] border-[#4F7CAC] ring-1 ring-[#4F7CAC]/40 shadow-[0_1px_3px_rgba(79,124,172,0.12)]'
                      : isCompleted
                      ? 'bg-white border-[#DCE4EC] hover:border-[#CBD6E2] shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_2px_6px_rgba(23,35,45,0.04)] hover:-translate-y-px'
                      : 'bg-[#F5F7F8] border-[#DCE4EC] opacity-75'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-medium text-[#61707C]">
                          Milestone {idx + 1}
                        </span>
                        <span className="text-xs text-[#8D9AA6]">•</span>
                        <span className="text-xs font-mono text-[#61707C]">{node.estimatedHours}h</span>
                        {isCurrent && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white text-[#4F7CAC] font-medium border border-[#DCE4EC] shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
                            Current Focus
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white text-[#5B9A7A] font-medium border border-[#DCE4EC] shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
                            Mastered
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm md:text-base font-semibold text-[#17232D]">{node.title}</h3>
                      <p className="text-xs text-[#61707C] leading-relaxed">{node.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Mark Complete Toggle Button */}
                      {!isLocked && (
                        <button
                          type="button"
                          onClick={() => toggleNodeCompletion(node.id)}
                          className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_2px_4px_rgba(23,35,45,0.04)] hover:-translate-y-px active:translate-y-0 ${
                            isCompleted
                              ? 'bg-white hover:bg-[#F3F7FA] text-[#61707C] border-[#DCE4EC] hover:border-[#CBD6E2]'
                              : 'bg-white hover:bg-[#F3F7FA] text-[#5B9A7A] border-[#DCE4EC] hover:border-[#CBD6E2]'
                          }`}
                        >
                          {isCompleted ? 'Mark Pending' : 'Mark Done'}
                        </button>
                      )}

                      {isCurrent && (
                        <button
                          id={`start-milestone-${node.id}`}
                          onClick={() => onStartLesson(node.title)}
                          className="px-3.5 py-1.5 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white font-medium text-xs flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_2px_6px_rgba(79,124,172,0.3)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-1 focus:ring-[#4F7CAC]"
                        >
                          <span>Resume Lesson</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {isCompleted && (
                        <button
                          onClick={() => onStartLesson(node.title)}
                          className="px-3.5 py-1.5 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white text-xs font-medium transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_2px_4px_rgba(79,124,172,0.25)] hover:-translate-y-px active:translate-y-0"
                        >
                          Review Lesson
                        </button>
                      )}
                      {isLocked && (
                        <span className="text-xs text-[#8D9AA6] font-mono flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sub-topics pills */}
                  {node.subTopics && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#DCE4EC]">
                      {node.subTopics.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] px-2 py-0.5 rounded bg-white border border-[#DCE4EC] text-[#61707C]"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
