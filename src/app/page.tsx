"use client";
import { HomePage } from '@/components/Home/HomePage';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return (
    <HomePage onLogin={(role) => router.push(`/portal/${role.toLowerCase()}`)} />
  );
}
