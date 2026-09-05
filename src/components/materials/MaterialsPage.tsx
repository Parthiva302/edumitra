import React, { useState, useEffect } from 'react';
import { UploadedMaterial } from '../../types';
import { 
  FileText, 
  Upload, 
  BookOpen,
  Search,
  Trash2
} from 'lucide-react';

interface MaterialsPageProps {
  materials: UploadedMaterial[];
  onUploadNew: () => void;
  onTeachFromMaterial: (material: UploadedMaterial) => void;
  onDeleteMaterial?: (materialId: string) => void;
}

export const MaterialsPage: React.FC<MaterialsPageProps> = ({
  materials: initialMaterials,
  onUploadNew,
  onTeachFromMaterial,
  onDeleteMaterial
}) => {
  const [items, setItems] = useState<UploadedMaterial[]>(initialMaterials);

  useEffect(() => {
    setItems(initialMaterials);
  }, [initialMaterials]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(m => m.id !== id));
    if (onDeleteMaterial) {
      onDeleteMaterial(id);
    }
    setDeleteConfirmId(null);
  };

  const filteredMaterials = items.filter(mat => {
    const matchesSearch = mat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mat.keyConceptsExtracted && mat.keyConceptsExtracted.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesType = filterType === 'ALL' || mat.type.toUpperCase() === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div id="materials-library-page" className="space-y-6 md:space-y-8 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE4EC] pb-4">
        <div>
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#61707C]">
            Document Repository
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#17232D] tracking-tight">
            Learning Materials & Textbooks
          </h1>
          <p className="text-xs md:text-sm text-[#61707C] mt-0.5">
            EduMitra indexes your uploaded documents for deep conceptual teaching and Q&A.
          </p>
        </div>

        <button
          id="upload-new-material-btn"
          onClick={onUploadNew}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white font-medium text-xs md:text-sm transition-all duration-150 cursor-pointer shadow-xs hover:shadow hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-1 focus:ring-[#4F7CAC]"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8D9AA6]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents or extracted concepts..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#DCE4EC] rounded-lg text-xs md:text-sm text-[#17232D] placeholder:text-[#8D9AA6] focus:outline-none focus:border-[#4F7CAC] transition-colors"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'PDF', 'DOCX', 'PPTX'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
                filterType === t
                  ? 'bg-[#4F7CAC] text-white shadow-2xs'
                  : 'bg-white text-[#61707C] hover:bg-[#F3F7FA] border border-[#DCE4EC]'
              }`}
            >
              {t === 'ALL' ? 'All Formats' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-12 text-center space-y-3 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
          <FileText className="w-8 h-8 text-[#8D9AA6] mx-auto" />
          <h3 className="font-semibold text-sm text-[#17232D]">No documents found</h3>
          <p className="text-xs text-[#61707C]">Try modifying your search or upload a new syllabus or notes document.</p>
          <button
            onClick={onUploadNew}
            className="px-4 py-2 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] text-white text-xs font-medium cursor-pointer transition-colors shadow-[0_1px_2px_rgba(79,124,172,0.2)]"
          >
            Upload Material Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all duration-150 group shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_4px_12px_rgba(23,35,45,0.06),0_1px_2px_rgba(23,35,45,0.03)] hover:-translate-y-px"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-md bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F3F7FA] text-[#61707C] border border-[#DCE4EC]">
                      {mat.type}
                    </span>
                    <button
                      onClick={() => setDeleteConfirmId(mat.id)}
                      className="p-1 rounded text-[#8D9AA6] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-[#17232D] text-sm group-hover:text-[#4F7CAC] transition-colors line-clamp-1">
                    {mat.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#61707C] mt-1 font-mono">
                    <span>{mat.size}</span>
                    <span>•</span>
                    <span>{mat.pages} Pages</span>
                    <span>•</span>
                    <span>{mat.uploadedAt}</span>
                  </div>
                </div>

                {/* Delete Confirmation Notice */}
                {deleteConfirmId === mat.id && (
                  <div className="p-2.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-md space-y-2">
                    <p className="text-[11px] text-[#991B1B] font-medium">Remove this document and syllabus index?</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(mat.id)}
                        className="px-2.5 py-1 rounded bg-[#DC2626] text-white text-[11px] font-medium cursor-pointer"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2.5 py-1 rounded bg-white text-[#61707C] border border-[#DCE4EC] text-[11px] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Extracted Concepts */}
                {mat.keyConceptsExtracted && (
                  <div className="space-y-1.5 pt-2 border-t border-[#DCE4EC]">
                    <span className="text-[11px] font-mono uppercase text-[#61707C] block font-medium">
                      Extracted Concepts:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {mat.keyConceptsExtracted.slice(0, 3).map((c, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#F3F7FA] border border-[#DCE4EC] text-[#17232D]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                id={`teach-material-${mat.id}`}
                onClick={() => onTeachFromMaterial(mat)}
                className="w-full py-2 px-3 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_2px_4px_rgba(79,124,172,0.25)] hover:-translate-y-px active:translate-y-0"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Teach From This Document</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
