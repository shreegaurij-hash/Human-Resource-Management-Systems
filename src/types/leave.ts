export type LeaveType = 'Paid' | 'Sick' | 'Unpaid';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason: string;
  appliedOn: string;
}

export interface LeaveBalance {
  employeeId: string;
  paidLeave: number;
  sickLeave: number;
  unpaidLeave: number;
}
