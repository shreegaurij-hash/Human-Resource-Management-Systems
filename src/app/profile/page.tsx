"use client";

import { useState } from "react";
import Link from "next/link";
import { ProfileView, ProfileEditForm } from "@/features/profiles";
import { useProfile } from "@/features/profiles/hooks/useProfile";
import { Profile } from "@/features/profiles/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ProfilePage() {
  const { user } = useCurrentUser();
  const { profile, isLoading, error } = useProfile(user?.id || "user-123");
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (error || !profile) return <div className="p-8 text-rose-500">Error loading profile</div>;

  const handleSave = async (updatedData: Partial<Profile>) => {
    // Mock save
    console.log("Saving...", updatedData);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm mb-10">
        <Link href="/" className="text-xl font-black tracking-tighter hover:opacity-70 transition-opacity">
          blond
        </Link>
        <div className="flex items-center gap-6 text-sm font-semibold text-gray-500">
          <Link href="/attendance" className="hover:text-gray-900 transition-colors">Attendance</Link>
          <Link href="/leave" className="hover:text-gray-900 transition-colors">Leave</Link>
          <Link href="/payroll" className="hover:text-gray-900 transition-colors">Salary</Link>
          <Link href="/profile" className="text-gray-900 border-b-2 border-blue-600 pb-0.5">Profile</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-500 font-medium text-sm">View and manage your personal information.</p>
        </header>

        {isEditing ? (
          <ProfileEditForm 
            profile={profile} 
            onSave={handleSave} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <ProfileView 
            profile={profile} 
            onEdit={() => setIsEditing(true)} 
          />
        )}
      </div>
    </div>
  );
}
