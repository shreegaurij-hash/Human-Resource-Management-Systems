"use client";

import { Mail, Phone, Building2, Briefcase, Calendar, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { Profile } from "../types";

interface ProfileViewProps {
  profile: Profile;
  onEdit: () => void;
  isAdmin?: boolean;
}

export function ProfileView({ profile, onEdit, isAdmin }: ProfileViewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200 dark:border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
        <div className="relative h-32 w-32 rounded-full overflow-hidden bg-neutral-100 dark:bg-gray-100 border-4 border-white dark:border-neutral-900 shadow-lg">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={`${profile.firstName} avatar`} className="object-cover w-full h-full" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-black text-gray-600">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-4xl font-black tracking-tight text-black dark:text-black">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-lg font-medium text-gray-500 mt-1">
            {profile.designation} • {profile.department}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="flex items-center gap-2 px-6 py-3 bg-[#F8F9FA] dark:bg-white text-black dark:text-black rounded-full font-bold hover:bg-gray-100 dark:hover:bg-neutral-200 transition-colors"
        >
          <Edit2 size={18} />
          {isAdmin ? "Edit Employee" : "Edit Profile"}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-gray-600 uppercase">Contact Information</h3>
          
          <div className="flex items-center gap-4 text-neutral-700 dark:text-gray-700">
            <div className="p-3 bg-neutral-100 dark:bg-white shadow-sm rounded-xl">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Email Address</p>
              <p className="font-bold">{profile.contactEmail}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-neutral-700 dark:text-gray-700">
            <div className="p-3 bg-neutral-100 dark:bg-white shadow-sm rounded-xl">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Phone Number</p>
              <p className="font-bold">{profile.phoneNumber || "Not provided"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-gray-600 uppercase">Work Details</h3>
          
          <div className="flex items-center gap-4 text-neutral-700 dark:text-gray-700">
            <div className="p-3 bg-neutral-100 dark:bg-white shadow-sm rounded-xl">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Department</p>
              <p className="font-bold">{profile.department}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-neutral-700 dark:text-gray-700">
            <div className="p-3 bg-neutral-100 dark:bg-white shadow-sm rounded-xl">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Join Date</p>
              <p className="font-bold">{new Date(profile.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
