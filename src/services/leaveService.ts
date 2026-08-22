import { LeaveRequest, LeaveBalance, LeaveType } from '../types/leave';

const mockLeaveBalances: Record<string, LeaveBalance> = {
  'emp-1': { employeeId: 'emp-1', paidLeave: 15, sickLeave: 10, unpaidLeave: 30 },
};

const mockLeaveRequests: LeaveRequest[] = [];

export const leaveService = {
  getLeaveBalance: (employeeId: string): LeaveBalance => {
    if (!mockLeaveBalances[employeeId]) {
      throw new Error('Employee not found');
    }
    return mockLeaveBalances[employeeId];
  },

  applyForLeave: (
    employeeId: string,
    leaveType: LeaveType,
    startDate: string,
    endDate: string,
    reason: string
  ): LeaveRequest => {
    // Basic validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      throw new Error('End date cannot be before start date');
    }

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    const balance = mockLeaveBalances[employeeId];

    if (!balance) {
      throw new Error('Employee not found');
    }

    // Check balance for Paid and Sick leaves
    if (leaveType === 'Paid' && balance.paidLeave < diffDays) {
      throw new Error('Insufficient Paid Leave balance');
    }
    if (leaveType === 'Sick' && balance.sickLeave < diffDays) {
      throw new Error('Insufficient Sick Leave balance');
    }

    const newRequest: LeaveRequest = {
      id: `lr-${Math.random().toString(36).substring(2, 9)}`,
      employeeId,
      leaveType,
      startDate,
      endDate,
      status: 'Pending',
      reason,
      appliedOn: new Date().toISOString(),
    };

    mockLeaveRequests.push(newRequest);
    return newRequest;
  },

  getLeaveRequests: (employeeId: string): LeaveRequest[] => {
    return mockLeaveRequests.filter((req) => req.employeeId === employeeId);
  }
};
