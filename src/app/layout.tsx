import './globals.css';
import { ReactNode } from 'react';
import { FluidBackground } from '@/components/Home/FluidBackground';

import { ChatbotPopup } from '@/components/Chatbot/ChatbotPopup';

export const metadata = {
  title: 'Blond HRMS',
  description: 'Human Resource Management System',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8F9FA] text-black font-sans overflow-x-hidden relative selection:bg-yellow-300 selection:text-black">
        <FluidBackground />
        
        <div className="relative z-10">
          {children}
        </div>
        <ChatbotPopup />
      </body>
    </html>
  );
}
