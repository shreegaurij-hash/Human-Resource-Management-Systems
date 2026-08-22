"use client";

import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Loader2, FileSpreadsheet, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatasetUploaderProps {
  onLoginRequest?: () => void;
}

export const DatasetUploader: React.FC<DatasetUploaderProps> = ({ onLoginRequest }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [error, setError] = useState("");

  const handleDrop = async (e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let file: File | null = null;
    
    if ('dataTransfer' in e) {
      file = e.dataTransfer.files[0];
    } else if ('target' in e && e.target.files) {
      file = e.target.files[0];
    }

    if (!file) return;

    setIsUploading(true);
    setError("");
    setUploadSuccess(false);
    setAnalysis("");

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload-company', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setUploadSuccess(true);
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  const preventDefault = (e: React.DragEvent) => e.preventDefault();

  return (
    <section className="relative z-10 py-32 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-bold mb-6">
          <Sparkles size={16} />
          <span>Onboard Your Company</span>
        </div>
        <h2 className="text-4xl font-black mb-4 text-white">Migrate to Blond Instantly</h2>
        <p className="text-zinc-400 font-medium mb-12">
          Drag and drop your company's employee dataset (.xlsx, .csv). Our AI will instantly map your workforce and generate secure login credentials for your entire team.
        </p>

        <label 
          onDragOver={preventDefault}
          onDragEnter={preventDefault}
          onDrop={handleDrop}
          className={`relative border-2 rounded-3xl p-16 flex flex-col items-center justify-center transition-all overflow-hidden group ${
            isUploading 
              ? 'border-yellow-400 bg-yellow-500/10 border-solid' 
              : uploadSuccess 
                ? 'border-emerald-500/50 bg-zinc-900/50 border-solid cursor-default' 
                : 'border-zinc-800 border-dashed bg-zinc-950 hover:border-yellow-500/50 hover:bg-zinc-900 cursor-pointer shadow-2xl'
          }`}
        >
          {/* Subtle background gradient on hover */}
          {!isUploading && !uploadSuccess && (
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/0 via-yellow-500/0 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}
          {!uploadSuccess && <input type="file" accept=".xlsx,.xls,.csv,.json" className="hidden" onChange={handleDrop} />}
          
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                <Loader2 size={48} className="animate-spin text-yellow-500 mb-4" />
                <p className="text-xl font-bold text-white">Analyzing workforce data with Groq AI...</p>
              </motion.div>
            ) : uploadSuccess ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-6">Company Onboarded Successfully!</h3>
                <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-base text-zinc-300 font-medium w-full max-w-2xl text-left shadow-2xl leading-relaxed whitespace-pre-wrap">
                  {analysis}
                </div>
                
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onLoginRequest) onLoginRequest(); }}
                  className="mt-8 px-8 py-4 bg-yellow-400 text-black rounded-xl font-bold hover:bg-yellow-300 transition-colors shadow-[0_0_20px_rgba(252,239,59,0.3)] flex items-center gap-2"
                >
                  Sign in to Dashboard
                </button>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center shadow-2xl">
                    <UploadCloud size={36} className="text-yellow-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Click or drag dataset here</h3>
                <p className="text-sm text-zinc-400 font-medium bg-zinc-950/50 px-4 py-1.5 rounded-full border border-zinc-800">
                  Supports .xlsx, .csv, and .json
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </label>

        {error && (
          <div className="mt-6 p-4 bg-red-950 text-red-400 border border-red-900 rounded-xl text-sm font-bold">
            {error}
          </div>
        )}
      </div>
    </section>
  );
};
