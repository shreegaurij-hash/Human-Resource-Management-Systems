import { attendanceService } from '../services/attendanceService';

describe('Attendance Service', () => {
  const employeeId = 'emp-test';

  it('should allow check in', () => {
    const record = attendanceService.checkIn(employeeId);
    expect(record.employeeId).toBe(employeeId);
    expect(record.status).toBe('PRESENT');
    expect(record.checkOutTime).toBeNull();
  });

  it('should not allow double check in on same day', () => {
    expect(() => attendanceService.checkIn(employeeId)).toThrow('Already checked in for today');
  });

  it('should allow check out after check in', () => {
    const record = attendanceService.checkOut(employeeId);
    expect(record.checkOutTime).not.toBeNull();
    expect(record.workHours).not.toBeNull();
  });

  it('should not allow double check out', () => {
    expect(() => attendanceService.checkOut(employeeId)).toThrow('Already checked out for today');
  });

  it('should get history correctly', () => {
    const history = attendanceService.getHistory(employeeId);
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].employeeId).toBe(employeeId);
  });
});
