"use client";

import { ProfileView } from "@/features/profiles";
import { useProfile } from "@/features/profiles/hooks/useProfile";

export default function ProfilePage() {
  const { profile, isLoading, error } = useProfile("user-123");

  if (isLoading) return <div className="p-8 text-black">Loading...</div>;
  if (error || !profile) return <div className="p-8 text-red-500">Error loading profile</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-black p-8">
      <ProfileView profile={profile} onEdit={() => alert("Edit mode coming soon!")} />
    </div>
  );
}
