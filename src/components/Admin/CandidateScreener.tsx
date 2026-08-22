"use client";
import ReactMarkdown from "react-markdown";





import React, { useState } from 'react';
import { Upload, FileText, Bot, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CandidateScreener = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setIsParsing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setResumeText(data.text);
    } catch (err: any) {
      setError(err.message || "Failed to parse file.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleEvaluate = async () => {
    if (!jobDescription || !resumeText) {
      setError("Please provide both a Job Description and a Resume.");
      return;
    }

    setIsEvaluating(true);
    setError("");
    setEvaluation(null);

    try {
      const res = await fetch('/api/screener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resumeText })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to evaluate candidate.");
      
      if (data.choices && data.choices.length > 0) {
        setEvaluation(data.choices[0].message.content);
      } else {
        throw new Error("No evaluation generated.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-8 mb-8">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-6">
        <div className="w-12 h-12 bg-[#FCEF3B] rounded-xl flex items-center justify-center text-black">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-black">AI Candidate Screener</h2>
          <p className="text-gray-500 font-medium text-sm">Automated resume evaluation via Groq LLM</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column: Input */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Target Job Description</label>
            <textarea
              className="w-full h-40 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors resize-none"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Candidate Resume</label>
            
            <div className="flex gap-4 mb-4">
              <label className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-colors">
                <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleFileUpload} />
                {isParsing ? (
                  <Loader2 className="animate-spin text-black mb-2" size={24} />
                ) : resumeFile ? (
                  <CheckCircle2 className="text-emerald-500 mb-2" size={24} />
                ) : (
                  <Upload className="text-gray-400 mb-2" size={24} />
                )}
                <span className="text-sm font-bold text-gray-600">
                  {isParsing ? "Extracting Text..." : resumeFile ? resumeFile.name : "Upload PDF or TXT"}
                </span>
              </label>
            </div>

            <textarea
              className="w-full h-40 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors resize-none text-xs text-gray-600 font-mono"
              placeholder="Resume text will appear here. You can also paste it manually."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>

          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || !jobDescription || !resumeText}
            className="w-full py-4 bg-black text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isEvaluating ? <Loader2 className="animate-spin" size={18} /> : <Bot size={18} />}
            {isEvaluating ? "Analyzing Candidate..." : "Generate AI Evaluation"}
          </button>
        </div>

        {/* Right Column: Output */}
        <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 flex flex-col">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Screening Report</h3>
          
          <div className="flex-1 overflow-y-auto">
            {!evaluation ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <FileText size={48} className="mb-4 opacity-20" />
                <p className="font-medium text-sm">Provide a JD and Resume to generate a report.</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-gray-800 prose-headings:font-bold prose-headings:text-gray-900 prose-strong:font-semibold prose-strong:text-gray-900 prose-p:leading-relaxed prose-a:text-blue-600">
                <ReactMarkdown>{evaluation}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
