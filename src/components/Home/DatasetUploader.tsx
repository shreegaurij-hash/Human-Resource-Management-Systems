"use client";

import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Loader2, FileSpreadsheet, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DatasetUploader = () => {
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
    <section className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold mb-6">
          <Sparkles size={16} />
          <span>Onboard Your Company</span>
        </div>
        <h2 className="text-3xl font-black mb-4">Migrate to Dayflow Instantly</h2>
        <p className="text-gray-500 font-medium mb-8">
          Drag and drop your company's employee dataset (.xlsx, .csv). Our AI will instantly map your workforce and generate secure login credentials for your entire team.
        </p>

        <label 
          onDragOver={preventDefault}
          onDragEnter={preventDefault}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isUploading 
              ? 'border-yellow-400 bg-yellow-50' 
              : uploadSuccess 
                ? 'border-emerald-400 bg-emerald-50' 
                : 'border-gray-300 bg-white hover:border-black hover:bg-gray-50'
          }`}
        >
          <input type="file" accept=".xlsx,.xls,.csv,.json" className="hidden" onChange={handleDrop} />
          
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                <Loader2 size={48} className="animate-spin text-yellow-500 mb-4" />
                <p className="text-lg font-bold text-black">Analyzing workforce data with Groq AI...</p>
              </motion.div>
            ) : uploadSuccess ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
                <p className="text-lg font-bold text-black mb-2">Company Onboarded Successfully!</p>
                <div className="bg-white/60 p-4 rounded-xl border border-emerald-100 text-sm text-emerald-900 font-medium max-w-lg text-left">
                  {analysis}
                </div>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                <FileSpreadsheet size={48} className="text-gray-300 mb-4" />
                <p className="text-lg font-bold text-black mb-1">Click or drag dataset here</p>
                <p className="text-sm text-gray-400">Supports .xlsx, .csv, and .json</p>
              </motion.div>
            )}
          </AnimatePresence>
        </label>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold">
            {error}
          </div>
        )}
      </div>
    </section>
  );
};
