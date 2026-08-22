export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: AttendanceStatus;
  workHours: number | null;
}
