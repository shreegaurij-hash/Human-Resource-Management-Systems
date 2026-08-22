import { LeaveRequest, LeaveBalance, LeaveType } from '../types/leave';

const mockLeaveBalances: Record<string, LeaveBalance> = {
  'emp-1': { employeeId: 'emp-1', paidLeave: 15, sickLeave: 10, unpaidLeave: 30 },
  'emp-2': { employeeId: 'emp-2', paidLeave: 12, sickLeave: 8, unpaidLeave: 30 },
  'emp-3': { employeeId: 'emp-3', paidLeave: 18, sickLeave: 10, unpaidLeave: 30 },
  'emp-4': { employeeId: 'emp-4', paidLeave: 10, sickLeave: 5, unpaidLeave: 30 },
};

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'lr-101',
    employeeId: 'emp-2',
    leaveType: 'Paid',
    startDate: '2026-08-25',
    endDate: '2026-08-28',
    status: 'Pending',
    reason: 'Attending family wedding out of town',
    appliedOn: '2026-08-20T10:15:00.000Z',
  },
  {
    id: 'lr-102',
    employeeId: 'emp-3',
    leaveType: 'Sick',
    startDate: '2026-08-21',
    endDate: '2026-08-22',
    status: 'Pending',
    reason: 'Viral fever and prescribed rest',
    appliedOn: '2026-08-21T08:30:00.000Z',
  },
  {
    id: 'lr-100',
    employeeId: 'emp-1',
    leaveType: 'Paid',
    startDate: '2026-07-10',
    endDate: '2026-07-12',
    status: 'Approved',
    reason: 'Personal vacation',
    appliedOn: '2026-07-01T14:00:00.000Z',
  },
];

export const leaveService = {
  getLeaveBalance: (employeeId: string): LeaveBalance => {
    if (!mockLeaveBalances[employeeId]) {
      // Default fallback balance
      mockLeaveBalances[employeeId] = { employeeId, paidLeave: 15, sickLeave: 10, unpaidLeave: 30 };
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
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      throw new Error('End date cannot be before start date');
    }

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    const balance = leaveService.getLeaveBalance(employeeId);

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

    mockLeaveRequests.unshift(newRequest);
    return newRequest;
  },

  getLeaveRequests: (employeeId: string): LeaveRequest[] => {
    return mockLeaveRequests.filter((req) => req.employeeId === employeeId);
  },

  getAllLeaveRequests: (): LeaveRequest[] => {
    return [...mockLeaveRequests];
  },

  approveLeaveRequest: (requestId: string, _adminNote?: string): LeaveRequest => {
    const request = mockLeaveRequests.find((req) => req.id === requestId);
    if (!request) {
      throw new Error(`Leave request ${requestId} not found`);
    }

    if (request.status === 'Approved') {
      return request;
    }

    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    const diffDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);

    const balance = leaveService.getLeaveBalance(request.employeeId);
    if (request.leaveType === 'Paid') {
      balance.paidLeave = Math.max(0, balance.paidLeave - diffDays);
    } else if (request.leaveType === 'Sick') {
      balance.sickLeave = Math.max(0, balance.sickLeave - diffDays);
    } else if (request.leaveType === 'Unpaid') {
      balance.unpaidLeave = Math.max(0, balance.unpaidLeave - diffDays);
    }

    request.status = 'Approved';
    return request;
  },

  rejectLeaveRequest: (requestId: string, _adminNote?: string): LeaveRequest => {
    const request = mockLeaveRequests.find((req) => req.id === requestId);
    if (!request) {
      throw new Error(`Leave request ${requestId} not found`);
    }

    request.status = 'Rejected';
    return request;
  },
};
