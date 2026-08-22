"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockOnboardingList, mockOnboardingSteps } from '../mockData';
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, UserCheck, AlertCircle } from 'lucide-react';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const OnboardingChecklist: React.FC = () => {
  const [onboardingList, setOnboardingList] = useState(mockOnboardingList);
  const [expandedId, setExpandedId] = useState<string | null>(mockOnboardingList[0]?.id || null);

  const toggleStep = (hireId: string, stepId: string) => {
    setOnboardingList(prev => prev.map(hire => {
      if (hire.id !== hireId) return hire;
      
      const currentStatus = hire.progress[stepId as keyof typeof hire.progress];
      let nextStatus: "pending" | "in-progress" | "completed" = "completed";
      
      if (currentStatus === "pending") nextStatus = "in-progress";
      else if (currentStatus === "in-progress") nextStatus = "completed";
      else nextStatus = "pending";

      return {
        ...hire,
        progress: {
          ...hire.progress,
          [stepId]: nextStatus
        }
      };
    }));
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "completed": return <CheckCircle2 size={20} className="text-emerald-500" />;
      case "in-progress": return <Clock size={20} className="text-amber-500" />;
      default: return <Circle size={20} className="text-neutral-600" />;
    }
  };

  const calculateOverallProgress = (progress: Record<string, string>) => {
    const total = Object.keys(progress).length;
    const completed = Object.values(progress).filter(p => p === "completed").length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6 shadow-2xl w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold tracking-widest text-gray-600 uppercase flex items-center gap-2">
            <UserCheck size={16} className="text-blue-400" />
            New Hire Onboarding
          </h3>
          <p className="text-xs text-gray-500 mt-1">Track and manage onboarding progress for incoming employees.</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
          {onboardingList.length} Active Hires
        </div>
      </div>

      <div className="space-y-4">
        {onboardingList.map(hire => {
          const isExpanded = expandedId === hire.id;
          const overallProgress = calculateOverallProgress(hire.progress);
          
          return (
            <motion.div 
              key={hire.id}
              className={cn(
                "border rounded-xl transition-colors overflow-hidden",
                isExpanded ? "border-blue-500/50 bg-gray-100/80" : "border-gray-200 bg-gray-100/30 hover:border-gray-300 hover:bg-gray-100/50"
              )}
            >
              {/* Header (Clickable to expand) */}
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : hire.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-black text-black shadow-lg flex-shrink-0">
                    {hire.avatar}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-black truncate">{hire.name}</h4>
                    <p className="text-xs text-gray-600 font-medium truncate">{hire.role} • {hire.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Progress Bar Mini */}
                  <div className="hidden sm:flex flex-col items-end gap-1 w-32">
                    <span className="text-xs font-bold text-gray-700">{overallProgress}% Complete</span>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${overallProgress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-gray-500 flex-shrink-0">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {/* Expanded Checklist content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-300/50"
                  >
                    <div className="p-4 px-5 bg-white shadow-sm/50">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tasks to Complete</p>
                        <p className="text-xs text-gray-600">Joining: <span className="text-black font-medium">{hire.joinDate}</span></p>
                      </div>
                      
                      <div className="space-y-2">
                        {mockOnboardingSteps.map(step => {
                          const status = hire.progress[step.id as keyof typeof hire.progress];
                          
                          return (
                            <div 
                              key={step.id} 
                              onClick={() => toggleStep(hire.id, step.id)}
                              className="group flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-100/40 hover:bg-gray-200 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {getStatusIcon(status)}
                                <span className={cn(
                                  "text-sm font-medium transition-colors",
                                  status === "completed" ? "text-gray-500 line-through" : "text-black group-hover:text-blue-300"
                                )}>
                                  {step.label}
                                </span>
                              </div>
                              <span className={cn(
                                "text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md",
                                status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                                status === "in-progress" ? "bg-amber-500/10 text-amber-400" :
                                "bg-gray-200 text-gray-600"
                              )}>
                                {status.replace('-', ' ')}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {overallProgress === 100 && (
                        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-emerald-400 mt-0.5" />
                          <p className="text-sm text-emerald-400 font-medium">All onboarding tasks are complete! This employee is fully ready.</p>
                        </div>
                      )}
                      
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
