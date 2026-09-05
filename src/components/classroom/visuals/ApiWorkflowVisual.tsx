import React, { useState } from 'react';
import { Send, Globe, Key, FileCode, CheckCircle2, Server, Laptop, ArrowRight, RefreshCw, Layers } from 'lucide-react';

interface WorkflowStep {
  step: string;
  detail: string;
}

interface ApiWorkflowVisualProps {
  title?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint?: string;
  headers?: Record<string, string>;
  requestBody?: string;
  statusCode?: number;
  statusText?: string;
  responseBody?: string;
  workflowSteps?: WorkflowStep[];
  className?: string;
}

export const ApiWorkflowVisual: React.FC<ApiWorkflowVisualProps> = ({
  title = "API Testing & HTTP Client-Server Architecture",
  method = "GET",
  endpoint = "https://api.edumitra.edu/v1/students/profile",
  headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  requestBody = '{\n  "studentId": "std_101",\n  "subject": "API Testing",\n  "status": "active"\n}',
  statusCode = 200,
  statusText = "200 OK",
  responseBody = '{\n  "status": "success",\n  "code": 200,\n  "data": {\n    "name": "Learner",\n    "activeLesson": "Postman API Automation",\n    "masteryScore": 94\n  }\n}',
  workflowSteps = [
    { step: "Client Request", detail: "Client specifies HTTP Method (GET/POST) and Target Endpoint URL" },
    { step: "Headers & Auth", detail: "Attaches Authorization Bearer token & Content-Type metadata" },
    { step: "Server Routing", detail: "API gateway routes request to service controller & database" },
    { step: "HTTP Response", detail: "Returns Status 200 OK with formatted JSON payload response" }
  ],
  className = ''
}) => {
  const methodDefaults: Record<'GET' | 'POST' | 'PUT' | 'DELETE', {
    endpoint: string;
    body?: string;
    statusCode: number;
    statusText: string;
    response: string;
  }> = {
    GET: {
      endpoint: endpoint || "https://api.edumitra.edu/v1/students/profile",
      statusCode: 200,
      statusText: "200 OK",
      response: responseBody || '{\n  "status": "success",\n  "code": 200,\n  "data": {\n    "name": "Learner",\n    "activeLesson": "Postman API Automation",\n    "masteryScore": 94\n  }\n}'
    },
    POST: {
      endpoint: "https://api.edumitra.edu/v1/students/register",
      body: '{\n  "fullName": "Priya Sharma",\n  "course": "REST API Architecture",\n  "level": "Intermediate"\n}',
      statusCode: 201,
      statusText: "201 Created",
      response: '{\n  "status": "created",\n  "code": 201,\n  "message": "Student record created successfully",\n  "studentId": "std_209",\n  "timestamp": "2026-09-05T01:32:00Z"\n}'
    },
    PUT: {
      endpoint: "https://api.edumitra.edu/v1/students/std_101",
      body: '{\n  "masteryScore": 98,\n  "status": "graduated",\n  "completedModules": 12\n}',
      statusCode: 200,
      statusText: "200 OK",
      response: '{\n  "status": "updated",\n  "code": 200,\n  "message": "Student profile updated successfully",\n  "modifiedCount": 1\n}'
    },
    DELETE: {
      endpoint: "https://api.edumitra.edu/v1/students/std_101",
      statusCode: 204,
      statusText: "204 No Content",
      response: '// 204 No Content\n// The server successfully processed the request and is not returning any content.'
    }
  };

  const [selectedMethod, setSelectedMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>(method);
  const [currentEndpoint, setCurrentEndpoint] = useState<string>(endpoint);
  const [currentBody, setCurrentBody] = useState<string>(requestBody);
  const [currentResponse, setCurrentResponse] = useState<string>(responseBody);
  const [currentStatusCode, setCurrentStatusCode] = useState<number>(statusCode);
  const [currentStatusText, setCurrentStatusText] = useState<string>(statusText);
  const [activeTab, setActiveTab] = useState<'request' | 'response' | 'architecture'>('architecture');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [responseTime, setResponseTime] = useState<number>(34);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const handleMethodChange = (m: 'GET' | 'POST' | 'PUT' | 'DELETE') => {
    setSelectedMethod(m);
    const defaults = methodDefaults[m];
    setCurrentEndpoint(defaults.endpoint);
    if (defaults.body) setCurrentBody(defaults.body);
    setCurrentStatusCode(defaults.statusCode);
    setCurrentStatusText(defaults.statusText);
    setCurrentResponse(defaults.response);
  };

  const getMethodColor = (m: string) => {
    switch (m) {
      case 'GET': return 'bg-[#5B9A7A] text-white';
      case 'POST': return 'bg-[#C58B3A] text-white';
      case 'PUT': return 'bg-[#4F7CAC] text-white';
      case 'DELETE': return 'bg-[#B76565] text-white';
      default: return 'bg-[#61707C] text-white';
    }
  };

  const handleSendRequest = () => {
    setIsSending(true);
    const randomLatency = Math.floor(Math.random() * 30) + 25;
    setTimeout(() => {
      setIsSending(false);
      setResponseTime(randomLatency);
      setActiveTab('response');
    }, 600);
  };

  return (
    <div className={`flex flex-col h-full bg-white border border-[#DCE4EC] rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#DCE4EC] bg-[#F5F7F8]">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#4F7CAC]" />
          <span className="text-xs font-semibold text-[#17232D] tracking-tight">{title}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E8F1F7] text-[#4F7CAC] font-mono border border-[#D0E1EE]">
            Postman / REST
          </span>
        </div>
        <div className="flex items-center gap-1">
          {(['GET', 'POST', 'PUT', 'DELETE'] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleMethodChange(m)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                selectedMethod === m
                  ? getMethodColor(m)
                  : 'bg-white text-[#61707C] border border-[#DCE4EC] hover:bg-[#F3F7FA]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* URL Request Bar */}
      <div className="p-3 bg-[#F8FAFC] border-b border-[#DCE4EC] flex items-center gap-2">
        <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold shrink-0 ${getMethodColor(selectedMethod)}`}>
          {selectedMethod}
        </span>
        <input
          type="text"
          value={currentEndpoint}
          onChange={(e) => setCurrentEndpoint(e.target.value)}
          placeholder="https://api.edumitra.edu/v1/..."
          className="flex-1 bg-white border border-[#DCE4EC] rounded-lg px-3 py-1.5 text-xs font-mono text-[#17232D] focus:outline-none focus:ring-1 focus:ring-[#4F7CAC] shadow-xs"
        />
        <button
          onClick={handleSendRequest}
          disabled={isSending}
          className="px-3.5 py-1.5 rounded-lg bg-[#4F7CAC] hover:bg-[#3E6794] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>{isSending ? 'Sending...' : 'Send'}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center border-b border-[#DCE4EC] bg-[#F5F7F8] px-3 gap-2 text-xs">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`py-2 px-3 font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'architecture'
              ? 'border-[#4F7CAC] text-[#4F7CAC]'
              : 'border-transparent text-[#61707C] hover:text-[#17232D]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Client-Server Flow</span>
        </button>

        <button
          onClick={() => setActiveTab('request')}
          className={`py-2 px-3 font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'request'
              ? 'border-[#4F7CAC] text-[#4F7CAC]'
              : 'border-transparent text-[#61707C] hover:text-[#17232D]'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Headers & Payload</span>
        </button>

        <button
          onClick={() => setActiveTab('response')}
          className={`py-2 px-3 font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'response'
              ? 'border-[#4F7CAC] text-[#4F7CAC]'
              : 'border-transparent text-[#61707C] hover:text-[#17232D]'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Response Body ({currentStatusCode})</span>
        </button>
      </div>

      {/* Main Visual Display Stage */}
      <div className="flex-1 p-4 bg-radial from-[#F5F7F8] to-[#E8EFF5] overflow-y-auto">
        {/* Tab 1: Client-Server Architecture Diagram */}
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            {/* Visual Animated Network Pipeline */}
            <div className="p-4 bg-white rounded-xl border border-[#DCE4EC] shadow-xs flex items-center justify-between">
              {/* Client Node */}
              <div className="flex flex-col items-center gap-1 text-center w-28">
                <div className="w-12 h-12 rounded-xl bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] flex items-center justify-center shadow-xs">
                  <Laptop className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-[#17232D]">Client / Postman</span>
                <span className="text-[10px] text-[#61707C]">HTTP Initiator</span>
              </div>

              {/* Request Flow Arrow */}
              <div className="flex-1 flex flex-col items-center px-2">
                <span className="text-[10px] font-mono text-[#4F7CAC] font-bold mb-1">
                  {selectedMethod} Request →
                </span>
                <div className="w-full h-1 bg-[#4F7CAC] rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/60 animate-pulse" />
                </div>
                <span className="text-[9px] text-[#8D9AA6] mt-1 font-mono">JSON + Bearer Auth</span>
              </div>

              {/* Server Gateway Node */}
              <div className="flex flex-col items-center gap-1 text-center w-28">
                <div className="w-12 h-12 rounded-xl bg-[#EAF4EE] text-[#5B9A7A] border border-[#D0E6D8] flex items-center justify-center shadow-xs">
                  <Server className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-[#17232D]">Backend API</span>
                <span className="text-[10px] text-[#5B9A7A] font-bold">{currentStatusCode} {currentStatusText}</span>
              </div>
            </div>

            {/* Workflow Step Explanations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {workflowSteps.map((ws, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                    activeStepIndex === idx
                      ? 'bg-[#E8F1F7] border-[#4F7CAC] shadow-xs'
                      : 'bg-white border-[#DCE4EC] hover:border-[#CBD6E2]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#17232D] text-[11px]">{ws.step}</span>
                    <span className="w-4 h-4 rounded-full bg-white border border-[#DCE4EC] text-[10px] font-mono font-bold flex items-center justify-center text-[#4F7CAC]">
                      {idx + 1}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#61707C] leading-snug">{ws.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Request Headers & Payload */}
        {activeTab === 'request' && (
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg border border-[#DCE4EC] shadow-xs space-y-1.5">
              <span className="text-[11px] font-bold text-[#17232D] block">Request Headers:</span>
              <div className="space-y-1 font-mono text-[11px]">
                {Object.entries(headers).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between p-1.5 bg-[#F8FAFC] rounded border border-[#E8EFF5]">
                    <span className="text-[#4F7CAC] font-semibold">{k}:</span>
                    <span className="text-[#61707C] truncate max-w-[200px]">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedMethod !== 'GET' && (
              <div className="p-3 bg-[#1E293B] text-slate-100 rounded-lg border border-slate-700 shadow-xs font-mono text-xs">
                <span className="text-[10px] text-slate-400 font-sans block mb-1">Request Payload (application/json):</span>
                <textarea
                  value={currentBody}
                  onChange={(e) => setCurrentBody(e.target.value)}
                  rows={5}
                  className="w-full bg-[#0F172A] text-[#38BDF8] p-2 rounded border border-slate-700 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Response Inspector */}
        {activeTab === 'response' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#DCE4EC] shadow-xs text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#EAF4EE] text-[#5B9A7A] font-mono font-bold border border-[#D0E6D8]">
                  Status: {currentStatusCode} {currentStatusText}
                </span>
                <span className="text-[#61707C] text-[11px]">Time: {responseTime}ms</span>
              </div>
              <span className="text-[11px] font-mono text-[#61707C]">Content-Type: application/json</span>
            </div>

            <div className="p-3 bg-[#0F172A] text-slate-100 rounded-lg border border-slate-800 shadow-xs font-mono text-xs overflow-x-auto">
              <pre className="text-[#34D399]">{currentResponse}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
