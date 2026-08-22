import { leaveService } from '../services/leaveService';

describe('Leave Service', () => {
  const employeeId = 'emp-1';

  it('should return correct initial leave balance', () => {
    const balance = leaveService.getLeaveBalance(employeeId);
    expect(balance).toEqual({
      employeeId: 'emp-1',
      paidLeave: 15,
      sickLeave: 10,
      unpaidLeave: 30,
    });
  });

  it('should successfully apply for a valid leave', () => {
    const request = leaveService.applyForLeave(
      employeeId,
      'Paid',
      '2026-09-01',
      '2026-09-02',
      'Vacation'
    );
    expect(request).toBeDefined();
    expect(request.status).toBe('Pending');
    expect(request.leaveType).toBe('Paid');
    expect(request.reason).toBe('Vacation');
  });

  it('should reject application if end date is before start date', () => {
    expect(() => {
      leaveService.applyForLeave(employeeId, 'Sick', '2026-09-05', '2026-09-01', 'Fever');
    }).toThrow('End date cannot be before start date');
  });

  it('should reject application if insufficient balance', () => {
    expect(() => {
      leaveService.applyForLeave(employeeId, 'Paid', '2026-10-01', '2026-10-20', 'Long Trip');
    }).toThrow('Insufficient Paid Leave balance');
  });
});
