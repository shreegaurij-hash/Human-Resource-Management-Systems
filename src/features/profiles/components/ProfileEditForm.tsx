"use client";

import { useState } from "react";
import { Profile } from "../types";
import { motion } from "framer-motion";

interface ProfileEditFormProps {
  profile: Profile;
  onSave: (updatedProfile: Partial<Profile>) => Promise<void>;
  onCancel: () => void;
  isAdmin?: boolean;
}

export function ProfileEditForm({ profile, onSave, onCancel, isAdmin }: ProfileEditFormProps) {
  const [formData, setFormData] = useState<Partial<Profile>>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    contactEmail: profile.contactEmail,
    phoneNumber: profile.phoneNumber || "",
    // Only admins can change department and designation usually, but keeping it simple for now
    department: profile.department,
    designation: profile.designation,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-8 md:p-10 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b border-gray-100 pb-4">Edit Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">First Name</label>
          <input 
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-gray-900"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Name</label>
          <input 
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-gray-900"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact Email</label>
          <input 
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-gray-900"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone Number</label>
          <input 
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-gray-900"
          />
        </div>

        {isAdmin && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Department (Admin Only)</label>
              <input 
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg bg-blue-50/50 border border-blue-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-gray-900"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Designation (Admin Only)</label>
              <input 
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg bg-blue-50/50 border border-blue-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-gray-900"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button 
          type="button" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-lg font-semibold text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </motion.button>
      </div>
    </form>
  );
}
