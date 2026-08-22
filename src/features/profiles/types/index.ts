export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  contactEmail: string;
  phoneNumber?: string;
  department: string;
  designation: string;
  joinDate: string | Date;
  avatarUrl?: string;
}
