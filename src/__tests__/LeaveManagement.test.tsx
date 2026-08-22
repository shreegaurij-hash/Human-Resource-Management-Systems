import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeaveManagement } from '../components/Leave/LeaveManagement';
import { leaveService } from '../services/leaveService';
import '@testing-library/jest-dom';

// Mock the framer-motion library to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const actualFramerMotion = jest.requireActual('framer-motion');
  return {
    ...actualFramerMotion,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      header: ({ children, ...props }: any) => <header {...props}>{children}</header>
    }
  };
});

describe('LeaveManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup initial mock return values
    jest.spyOn(leaveService, 'getLeaveBalance').mockReturnValue({
      employeeId: 'emp-1',
      paidLeave: 10,
      sickLeave: 5,
      unpaidLeave: 20
    });
    jest.spyOn(leaveService, 'getLeaveRequests').mockReturnValue([]);
  });

  it('renders correctly with leave balances', () => {
    render(<LeaveManagement />);
    expect(screen.getByText('Time Off')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // Paid
    expect(screen.getByText('5')).toBeInTheDocument();  // Sick
    expect(screen.getByText('20')).toBeInTheDocument(); // Unpaid
  });

  it('handles successful leave application', () => {
    jest.spyOn(leaveService, 'applyForLeave').mockReturnValue({
      id: 'lr-123',
      employeeId: 'emp-1',
      leaveType: 'Paid',
      startDate: '2026-09-01',
      endDate: '2026-09-02',
      status: 'Pending',
      reason: 'Vacation',
      appliedOn: '2026-08-22T00:00:00.000Z'
    });

    jest.spyOn(leaveService, 'getLeaveRequests').mockReturnValueOnce([]).mockReturnValueOnce([
      {
        id: 'lr-123',
        employeeId: 'emp-1',
        leaveType: 'Paid',
        startDate: '2026-09-01',
        endDate: '2026-09-02',
        status: 'Pending',
        reason: 'Vacation',
        appliedOn: '2026-08-22T00:00:00.000Z'
      }
    ]);

    render(<LeaveManagement />);
    
    // Fill the form
    fireEvent.change(screen.getByLabelText(/Leave Type/i), { target: { value: 'Paid' } });
    fireEvent.change(screen.getAllByLabelText(/Start Date/i)[0], { target: { value: '2026-09-01' } });
    fireEvent.change(screen.getAllByLabelText(/End Date/i)[0], { target: { value: '2026-09-02' } });
    fireEvent.change(screen.getByLabelText(/Reason/i), { target: { value: 'Vacation' } });

    // Submit
    fireEvent.click(screen.getByText(/Submit Request/i));

    // Assertions
    expect(leaveService.applyForLeave).toHaveBeenCalledWith('emp-1', 'Paid', '2026-09-01', '2026-09-02', 'Vacation');
    expect(screen.getByText('Leave request submitted successfully.')).toBeInTheDocument();
    expect(screen.getByText('2026-09-01 to 2026-09-02')).toBeInTheDocument();
  });

  it('displays error on failed submission', () => {
    jest.spyOn(leaveService, 'applyForLeave').mockImplementation(() => {
      throw new Error('Insufficient Paid Leave balance');
    });

    render(<LeaveManagement />);
    
    fireEvent.change(screen.getByLabelText(/Leave Type/i), { target: { value: 'Paid' } });
    fireEvent.change(screen.getAllByLabelText(/Start Date/i)[0], { target: { value: '2026-09-01' } });
    fireEvent.change(screen.getAllByLabelText(/End Date/i)[0], { target: { value: '2026-09-20' } });
    fireEvent.change(screen.getByLabelText(/Reason/i), { target: { value: 'Long Trip' } });

    fireEvent.click(screen.getByText(/Submit Request/i));

    expect(screen.getByText('Insufficient Paid Leave balance')).toBeInTheDocument();
  });
});
