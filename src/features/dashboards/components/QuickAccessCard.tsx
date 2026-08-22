"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface QuickAccessCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export function QuickAccessCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  onClick,
}: QuickAccessCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-[#F8F9FA] p-6 text-black shadow-xl transition-colors hover:bg-white shadow-sm cursor-pointer border border-gray-200",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-widest text-gray-600 uppercase">
          {title}
        </h3>
        <div className="rounded-full bg-gray-100 p-3 text-black transition-transform group-hover:rotate-12">
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-4xl font-extrabold tracking-tight">
          {value}
        </span>
        
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-2 text-sm font-medium">
            {trend && (
              <span
                className={cn(
                  "flex items-center rounded-full px-2 py-0.5 text-xs font-bold",
                  trend.isPositive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-rose-500/10 text-rose-400"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <span className="text-gray-500">{description}</span>
            )}
          </div>
        )}
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white opacity-[0.03] blur-2xl transition-opacity group-hover:opacity-[0.06]" />
    </motion.div>
  );
}
