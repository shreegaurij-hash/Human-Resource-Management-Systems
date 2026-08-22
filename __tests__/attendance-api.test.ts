// Mocking external dependencies for isolated testing
jest.mock('@/lib/prisma', () => ({
  prisma: {
    attendance: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    }
  }
}));

jest.mock('@/lib/auth', () => ({
  getServerSession: jest.fn(),
}));

import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';
import { POST as checkIn } from '@/app/api/attendance/check-in/route';

describe('Attendance API - Check In', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);
    const req = new Request('http://localhost/api/attendance/check-in', { method: 'POST' });
    const res = await checkIn(req);
    expect(res.status).toBe(401);
  });

  it('should return 400 if user already checked in today', async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { id: 'user-1' } });
    (prisma.attendance.findUnique as jest.Mock).mockResolvedValueOnce({ id: 'att-1' }); // Found existing
    
    const req = new Request('http://localhost/api/attendance/check-in', { method: 'POST' });
    const res = await checkIn(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Already checked in for today');
  });

  it('should create attendance and return 201 if successful', async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { id: 'user-1' } });
    (prisma.attendance.findUnique as jest.Mock).mockResolvedValueOnce(null); // Not found
    (prisma.attendance.create as jest.Mock).mockResolvedValueOnce({ id: 'att-new', status: 'PRESENT' });
    
    const req = new Request('http://localhost/api/attendance/check-in', { method: 'POST' });
    const res = await checkIn(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.message).toBe('Check-in successful');
  });
});
