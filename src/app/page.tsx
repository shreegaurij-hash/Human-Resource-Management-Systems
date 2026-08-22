"use client";
import { useRouter } from 'next/navigation';
import { HomePage } from '@/components/Home/HomePage';

export default function Page() {
  const router = useRouter();

  const handleLogin = (role: 'Admin' | 'Employee') => {
    if (role === 'Employee') {
      router.push('/attendance');
    } else {
      // Admin portal — will be built by SG/Ninaad. Redirects to attendance for now.
      router.push('/attendance');
    }
  };

  return (
    <HomePage onLogin={handleLogin} />
  );
}
