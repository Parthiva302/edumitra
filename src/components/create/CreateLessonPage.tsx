import React, { useState } from 'react';
import { Upload, Compass, FileText, CheckCircle2, ArrowRight, X, FileCheck, AlertCircle } from 'lucide-react';
import { UploadedMaterial } from '../../types';
import { api } from '../../services/api';

interface CreateLessonPageProps {
  onStartWithTopic: (topic: string) => void;
  onStartWithMaterial: (material: UploadedMaterial) => void;
  initialTopic?: string;
}

export const CreateLessonPage: React.FC<CreateLessonPageProps> = ({
  onStartWithTopic,
  onStartWithMaterial,
  initialTopic = ''
}) => {
  const [topicInput, setTopicInput] = useState(initialTopic);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedMaterial | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<string>('Uploading...');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const suggestedTopics = [
    { title: "Newton's Laws of Motion", category: "Physics" },
    { title: "Python from Beginner Level", category: "Programming" },
    { title: "React for Technical Interviews", category: "Web Dev" },
    { title: "Artificial Intelligence & Neural Networks", category: "Computer Science" },
    { title: "Electricity & Ohm's Law", category: "Physics" },
    { title: "Photosynthesis & Cellular Respiration", category: "Biology" }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(20);
    setUploadStage('Uploading document to Supabase storage...');
    setUploadError(null);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 40) return prev + 10;
        if (prev < 75) {
          setUploadStage('Extracting text & analyzing structure...');
          return prev + 5;
        }
        if (prev < 90) {
          setUploadStage('Generating semantic embeddings & RAG index...');
          return prev + 3;
        }
        return prev;
      });
    }, 400);

    try {
      const material = await api.uploadMaterial(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStage('Material indexed and ready for learning!');
      setIsUploading(false);
      setUploadedFile(material);
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      const rawMsg = typeof err === 'string' ? err : err?.message;
      const cleanMsg = rawMsg && rawMsg !== '[object Object]'
        ? rawMsg
        : 'Failed to process document. Please ensure you are logged in and try again.';
      setUploadError(cleanMsg);
    }
  };

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topicInput.trim()) {
      onStartWithTopic(topicInput.trim());
    }
  };

  const handleMaterialContinue = () => {
    if (uploadedFile) {
      onStartWithMaterial(uploadedFile);
    }
  };

  return (
    <div id="create-lesson-page" className="max-w-5xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#61707C]">
          Step 1 of 3: Choose Learning Source
        </span>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#17232D] tracking-tight">
          How would you like to learn today?
        </h1>
        <p className="text-sm text-[#61707C]">
          Upload existing educational material or specify any custom topic for an interactive AI-led session.
        </p>
      </div>

      {/* Two Methods Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Method 1: Upload Learning Material */}
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#17232D] uppercase tracking-wider">Method 1</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] font-medium">
                Document Based
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#17232D] tracking-tight">Upload Learning Material</h2>
            <p className="text-xs text-[#61707C] leading-relaxed">
              Upload textbook chapters, lecture slides, research papers, DOCX, or study notes. EduMitra extracts concepts and crafts a structured curriculum.
            </p>
          </div>

          {/* Upload Zone */}
          {!uploadedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border border-dashed rounded-lg p-6 text-center transition-all duration-150 flex flex-col items-center justify-center min-h-[200px] ${
                dragActive
                  ? 'border-[#4F7CAC] bg-[#E8F1F7]'
                  : 'border-[#CBD6E2] bg-[#F3F7FA] hover:border-[#4F7CAC]/60 hover:bg-[#F3F7FA]/80'
              }`}
            >
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.docx,.doc,.pptx,.ppt,.txt"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-10 h-10 rounded-lg bg-[#E8F1F7] text-[#4F7CAC] mb-3 border border-[#D0E1EE] flex items-center justify-center shadow-[0_1px_2px_rgba(23,35,45,0.03)]">
                <Upload className="w-5 h-5 text-[#4F7CAC]" />
              </div>
              <p className="text-xs font-medium text-[#17232D]">
                Drag and drop your file here, or <span className="text-[#4F7CAC] underline hover:text-[#3D6692]">browse</span>
              </p>
              <p className="text-[11px] text-[#8D9AA6] mt-1">Supports PDF, DOCX, PPTX, TXT (up to 50MB)</p>

              {isUploading && (
                <div className="w-full mt-4 space-y-1.5 max-w-xs">
                  <div className="flex justify-between text-[11px] text-[#61707C]">
                    <span className="font-medium text-[#4F7CAC]">{uploadStage}</span>
                    <span className="font-mono">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#DCE4EC] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4F7CAC] rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="mt-3 p-2 rounded bg-[#F7EAEA] border border-[#ECD1D1] text-[11px] text-[#B76565] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          ) : (
            /* Uploaded File Ready State */
            <div className="bg-[#F3F7FA] border border-[#DCE4EC] rounded-lg p-4 space-y-3 shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] flex items-center justify-center shadow-[0_1px_2px_rgba(23,35,45,0.03)]">
                    <FileCheck className="w-4 h-4 text-[#5B9A7A]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#17232D] text-xs md:text-sm truncate max-w-[200px] sm:max-w-xs">
                      {uploadedFile.name}
                    </h3>
                    <p className="text-[11px] text-[#61707C]">
                      {uploadedFile.size} • {uploadedFile.pages || 10} sections analyzed
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="p-1 rounded text-[#8D9AA6] hover:text-[#17232D] hover:bg-[#E8F1F7] transition-colors cursor-pointer"
                  title="Remove uploaded file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2.5 bg-white rounded border border-[#DCE4EC] text-xs text-[#17232D] space-y-1 shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
                <span className="font-medium block text-[11px] text-[#61707C]">Extracted Concepts:</span>
                <p className="text-[11px] leading-relaxed text-[#61707C]">
                  {uploadedFile.keyConceptsExtracted && uploadedFile.keyConceptsExtracted.length > 0 
                    ? uploadedFile.keyConceptsExtracted.join(' • ')
                    : 'Foundational Theory • Mathematical Formulas • Real-World Applications'}
                </p>
              </div>

              <button
                id="continue-with-material-btn"
                onClick={handleMaterialContinue}
                className="w-full py-2.5 px-4 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white font-medium text-xs flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_2px_6px_rgba(79,124,172,0.3)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#4F7CAC]/40"
              >
                <span>Continue to Personalization</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Method 2: Ask a Topic */}
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#17232D] uppercase tracking-wider">Method 2</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] font-medium">
                Direct Topic
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#17232D] tracking-tight">Teach Me a Topic</h2>
            <p className="text-xs text-[#61707C] leading-relaxed">
              Enter any concept or skill you want to master. EduMitra structures the syllabus, selects visual models, and teaches interactively.
            </p>
          </div>

          {/* Topic Form */}
          <form onSubmit={handleTopicSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#17232D] block mb-1.5">
                What do you want to learn?
              </label>
              <input
                id="create-topic-input"
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. 'Explain Newton's Laws', 'Teach me Python'..."
                className="w-full bg-white border border-[#DCE4EC] hover:border-[#CBD6E2] focus:border-[#4F7CAC] focus:ring-1 focus:ring-[#4F7CAC]/20 rounded-lg px-3.5 py-2.5 text-xs md:text-sm text-[#17232D] placeholder:text-[#8D9AA6] focus:outline-none transition-all duration-150 shadow-[0_1px_2px_rgba(23,35,45,0.03)]"
              />
            </div>

            {/* Suggestions */}
            <div>
              <span className="text-[11px] font-medium text-[#61707C] block mb-1.5">Suggested Topics:</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedTopics.map((item, idx) => (
                  <button
                    key={idx}
                    id={`create-suggested-topic-${idx}`}
                    type="button"
                    onClick={() => setTopicInput(item.title)}
                    className="text-xs px-2.5 py-1 rounded-md bg-[#E8F1F7] hover:bg-[#D0E1EE] active:bg-[#B5CFE4] text-[#4F7CAC] border border-[#D0E1EE] transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_2px_4px_rgba(23,35,45,0.04)] hover:-translate-y-px active:translate-y-0"
                  >
                    <span>{item.title}</span>
                    <span className="text-[10px] text-[#78A6C8] font-mono">({item.category})</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              id="continue-with-topic-btn"
              type="submit"
              disabled={!topicInput.trim()}
              className={`w-full py-2.5 px-4 rounded-md font-medium text-xs flex items-center justify-center gap-2 transition-all duration-150 ${
                topicInput.trim()
                  ? 'bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white cursor-pointer shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_2px_6px_rgba(79,124,172,0.3)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#4F7CAC]/40'
                  : 'bg-[#F3F7FA] text-[#8D9AA6] border border-[#DCE4EC] cursor-not-allowed'
              }`}
            >
              <span>Continue with Topic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
