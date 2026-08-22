"use client";
import { HomePage } from '@/components/Home/HomePage';

export default function Page() {
  return (
    <HomePage onLogin={(role) => alert(`Routing to ${role} Portal...`)} />
  );
}
