import './globals.css';
import { ReactNode } from 'react';
import { FluidBackground } from '@/components/Home/FluidBackground';

export const metadata = {
  title: 'Dayflow HRMS',
  description: 'Human Resource Management System',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8F9FA] text-black font-sans overflow-x-hidden relative selection:bg-yellow-300 selection:text-black">
        <FluidBackground />
        
        {/* Navigation */}
        <nav className="flex justify-between items-center p-8 absolute w-full z-50">
          <a href="/" className="text-3xl font-extrabold tracking-tighter text-black flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full grid place-items-center">
               <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            dayflow
          </a>
          <div className="hidden md:flex items-center gap-8 font-medium">
            <button className="hover:opacity-60 transition-opacity">Solutions ˅</button>
            <button className="hover:opacity-60 transition-opacity">Work</button>
            <button className="hover:opacity-60 transition-opacity">About us</button>
            <a href="/"
              className="px-6 py-3 bg-black text-black rounded-lg hover:bg-gray-800 transition-colors font-semibold shadow-lg"
            >
              Get started
            </a>
          </div>
        </nav>

        <div className="relative z-10 pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
