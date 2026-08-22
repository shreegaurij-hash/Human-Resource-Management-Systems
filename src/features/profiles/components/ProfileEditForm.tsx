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
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-8 bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200 dark:border-gray-200 shadow-sm">
      <h2 className="text-3xl font-black mb-8 text-black dark:text-black">Edit Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">First Name</label>
          <input 
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-xl bg-neutral-100 dark:bg-white shadow-sm border border-transparent focus:border-black dark:focus:border-white outline-none transition-colors font-medium text-black dark:text-black"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
          <input 
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-xl bg-neutral-100 dark:bg-white shadow-sm border border-transparent focus:border-black dark:focus:border-white outline-none transition-colors font-medium text-black dark:text-black"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Contact Email</label>
          <input 
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-xl bg-neutral-100 dark:bg-white shadow-sm border border-transparent focus:border-black dark:focus:border-white outline-none transition-colors font-medium text-black dark:text-black"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
          <input 
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl bg-neutral-100 dark:bg-white shadow-sm border border-transparent focus:border-black dark:focus:border-white outline-none transition-colors font-medium text-black dark:text-black"
          />
        </div>

        {isAdmin && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-rose-500 uppercase tracking-wider">Department (Admin Only)</label>
              <input 
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 focus:border-rose-500 outline-none transition-colors font-medium text-black dark:text-black"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-rose-500 uppercase tracking-wider">Designation (Admin Only)</label>
              <input 
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 focus:border-rose-500 outline-none transition-colors font-medium text-black dark:text-black"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-end gap-4">
        <button 
          type="button" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 rounded-full font-bold text-gray-500 hover:text-black dark:hover:text-black transition-colors"
        >
          Cancel
        </button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-[#F8F9FA] dark:bg-white text-black dark:text-black rounded-full font-bold shadow-lg hover:bg-gray-100 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </motion.button>
      </div>
    </form>
  );
}
