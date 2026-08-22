import { AttendanceRecord } from '../types/attendance';

let mockAttendanceRecords: AttendanceRecord[] = [
  // pre-fill a couple records for history
  {
    id: 'att-1',
    employeeId: 'emp-1',
    date: new Date(Date.now() - 86400000).toISOString(),
    checkInTime: new Date(Date.now() - 86400000 - 3600000 * 8).toISOString(),
    checkOutTime: new Date(Date.now() - 86400000).toISOString(),
    status: 'PRESENT',
    workHours: 8,
  }
];

export const attendanceService = {
  getHistory: (employeeId: string, limit: number = 7): AttendanceRecord[] => {
    return mockAttendanceRecords
      .filter((r) => r.employeeId === employeeId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },

  getTodayRecord: (employeeId: string): AttendanceRecord | undefined => {
    const today = new Date().toLocaleDateString();
    return mockAttendanceRecords.find(
      (r) => r.employeeId === employeeId && new Date(r.date).toLocaleDateString() === today
    );
  },

  checkIn: (employeeId: string): AttendanceRecord => {
    const existing = attendanceService.getTodayRecord(employeeId);
    if (existing) {
      throw new Error('Already checked in for today');
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Math.random().toString(36).substring(2, 9)}`,
      employeeId,
      date: new Date().toISOString(),
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      status: 'PRESENT',
      workHours: null,
    };

    mockAttendanceRecords.push(newRecord);
    return newRecord;
  },

  checkOut: (employeeId: string): AttendanceRecord => {
    const existingIndex = mockAttendanceRecords.findIndex(
      (r) => r.employeeId === employeeId && new Date(r.date).toLocaleDateString() === new Date().toLocaleDateString()
    );

    if (existingIndex === -1) {
      throw new Error('No check-in record found for today');
    }

    const existing = mockAttendanceRecords[existingIndex];
    if (existing.checkOutTime) {
      throw new Error('Already checked out for today');
    }

    const now = new Date();
    const diffMs = now.getTime() - new Date(existing.checkInTime).getTime();
    const workHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    mockAttendanceRecords[existingIndex] = {
      ...existing,
      checkOutTime: now.toISOString(),
      workHours,
    };

    return mockAttendanceRecords[existingIndex];
  }
};
