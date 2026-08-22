"use client";

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function FluidBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 250);
      mouseY.set(e.clientY - 250);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
        className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] bg-[#FCEF3B]/50 rounded-full blur-[80px] z-0 transition-transform duration-700 ease-out"
      />
      <div className="fixed -bottom-[20%] -right-[10%] w-[800px] h-[800px] bg-yellow-200/60 rounded-full blur-[100px] pointer-events-none z-0" />
    </>
  );
}
