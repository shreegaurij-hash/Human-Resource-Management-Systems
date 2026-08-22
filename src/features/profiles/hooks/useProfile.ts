"use client";

import { useState, useEffect } from "react";
import { Profile } from "../types";

// Mock API calls for now to prevent blocking on backend
const fetchProfile = async (id: string): Promise<Profile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        userId: "user-123",
        firstName: "Sarah",
        lastName: "Connor",
        contactEmail: "sarah.connor@example.com",
        phoneNumber: "+1 (555) 019-2839",
        department: "Engineering",
        designation: "Senior Frontend Developer",
        joinDate: "2023-01-15T00:00:00.000Z",
      });
    }, 500);
  });
};

const updateProfileAPI = async (id: string, data: Partial<Profile>): Promise<Profile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        userId: "user-123",
        firstName: data.firstName || "Sarah",
        lastName: data.lastName || "Connor",
        contactEmail: data.contactEmail || "sarah.connor@example.com",
        phoneNumber: data.phoneNumber || "+1 (555) 019-2839",
        department: data.department || "Engineering",
        designation: data.designation || "Senior Frontend Developer",
        joinDate: "2023-01-15T00:00:00.000Z",
        ...data,
      });
    }, 500);
  });
};

export function useProfile(profileId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProfile(profileId);
        if (isMounted) setProfile(data);
      } catch (err) {
        if (isMounted) setError("Failed to load profile");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [profileId]);

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const updatedProfile = await updateProfileAPI(profileId, updates);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      throw new Error("Failed to update profile");
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
}
