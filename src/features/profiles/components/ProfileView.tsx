"use client";

import { Mail, Phone, Building2, Calendar, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { Profile } from "../types";

interface ProfileViewProps {
  profile: Profile;
  onEdit: () => void;
  isAdmin?: boolean;
}

export function ProfileView({ profile, onEdit, isAdmin }: ProfileViewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 md:p-10 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-10 border-b border-gray-100 pb-8">
        <div className="relative h-28 w-28 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={`${profile.firstName} avatar`} className="object-cover w-full h-full" />
          ) : (
            <span className="text-3xl font-bold text-gray-400">
              {profile.firstName[0]}{profile.lastName[0]}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-sm font-medium text-gray-500">
            {profile.designation} • {profile.department}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEdit}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Edit2 size={16} />
          {isAdmin ? "Edit Employee" : "Edit Profile"}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Contact Information</h3>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Email Address</p>
              <p className="font-semibold text-gray-900 text-sm">{profile.contactEmail}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Phone Number</p>
              <p className="font-semibold text-gray-900 text-sm">{profile.phoneNumber || "Not provided"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Work Details</h3>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
              <Building2 size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Department</p>
              <p className="font-semibold text-gray-900 text-sm">{profile.department}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Join Date</p>
              <p className="font-semibold text-gray-900 text-sm">{new Date(profile.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
