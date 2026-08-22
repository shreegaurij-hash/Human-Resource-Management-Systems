import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { leaveService } from '../../services/leaveService';
import { LeaveRequest, LeaveStatus, LeaveType } from '../../types/leave';

export const LeaveApproval: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('Pending');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const loadRequests = () => {
    setRequests(leaveService.getAllLeaveRequests());
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = () => {
    if (!selectedRequest || !actionType) return;

    try {
      if (actionType === 'Approve') {
        leaveService.approveLeaveRequest(selectedRequest.id, adminNote);
        setSuccessToast(`Approved leave request for employee ${selectedRequest.employeeId}`);
      } else {
        leaveService.rejectLeaveRequest(selectedRequest.id, adminNote);
        setSuccessToast(`Rejected leave request for employee ${selectedRequest.employeeId}`);
      }

      loadRequests();
      setSelectedRequest(null);
      setActionType(null);
      setAdminNote('');
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Error processing request');
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filterStatus === 'All') return true;
    return r.status === filterStatus;
  });

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length;

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-full text-xs font-bold uppercase tracking-wider">
            HR Admin Portal • Approvals Workflow
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 uppercase tracking-tight">
          Leave Approvals
        </h1>
        <p className="text-zinc-400 font-medium">
          Review, approve, or reject employee time-off applications and adjust leave balances.
        </p>
      </motion.div>

      {/* Success Notification */}
      {successToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl font-bold flex justify-between items-center"
        >
          <span>✅ {successToast}</span>
          <button onClick={() => setSuccessToast('')} className="text-zinc-500 hover:text-white">✕</button>
        </motion.div>
      )}

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => setFilterStatus('Pending')}
          className={`cursor-pointer p-6 rounded-3xl border transition-all ${
            filterStatus === 'Pending'
              ? 'bg-amber-500/20 border-amber-500 shadow-xl shadow-amber-500/10'
              : 'bg-zinc-900/90 border-zinc-800'
          }`}
        >
          <div className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
            Pending Action
          </div>
          <div className="text-4xl font-black text-white">{pendingCount}</div>
          <div className="text-xs text-zinc-400 mt-2">Requires Manager Review</div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => setFilterStatus('Approved')}
          className={`cursor-pointer p-6 rounded-3xl border transition-all ${
            filterStatus === 'Approved'
              ? 'bg-emerald-500/20 border-emerald-500 shadow-xl shadow-emerald-500/10'
              : 'bg-zinc-900/90 border-zinc-800'
          }`}
        >
          <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
            Approved Requests
          </div>
          <div className="text-4xl font-black text-white">{approvedCount}</div>
          <div className="text-xs text-zinc-400 mt-2">Deducted from Employee Balances</div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => setFilterStatus('Rejected')}
          className={`cursor-pointer p-6 rounded-3xl border transition-all ${
            filterStatus === 'Rejected'
              ? 'bg-rose-500/20 border-rose-500 shadow-xl shadow-rose-500/10'
              : 'bg-zinc-900/90 border-zinc-800'
          }`}
        >
          <div className="text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
            Rejected Requests
          </div>
          <div className="text-4xl font-black text-white">{rejectedCount}</div>
          <div className="text-xs text-zinc-400 mt-2">Dismissed Applications</div>
        </motion.div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex gap-3 mb-8 border-b border-zinc-800 pb-4 overflow-x-auto">
        {['Pending', 'Approved', 'Rejected', 'All'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
              filterStatus === status
                ? 'bg-white text-black shadow-lg'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {status} Requests
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-3xl text-center text-zinc-500 italic">
            No {filterStatus.toLowerCase()} leave requests found.
          </div>
        ) : (
          filteredRequests.map((req) => {
            const start = new Date(req.startDate);
            const end = new Date(req.endDate);
            const diffDays =
              Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 p-6 md:p-8 rounded-3xl backdrop-blur flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-black text-xl text-white">
                      Employee ID: {req.employeeId}
                    </span>
                    <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs font-bold">
                      {req.leaveType} Leave
                    </span>
                    <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-full text-xs font-bold">
                      {diffDays} {diffDays === 1 ? 'Day' : 'Days'}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        req.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : req.status === 'Rejected'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="text-sm text-zinc-400 font-medium">
                    Duration: <span className="text-white font-bold">{req.startDate}</span> to{' '}
                    <span className="text-white font-bold">{req.endDate}</span>
                  </div>

                  <div className="text-sm text-zinc-300 bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 mt-2">
                    <span className="text-zinc-500 font-bold uppercase text-xs block mb-1">
                      Reason Provided:
                    </span>
                    "{req.reason}"
                  </div>

                  <div className="text-xs text-zinc-500">
                    Applied on: {new Date(req.appliedOn).toLocaleString()}
                  </div>
                </div>

                {req.status === 'Pending' && (
                  <div className="flex gap-3 w-full lg:w-auto">
                    <button
                      onClick={() => {
                        setSelectedRequest(req);
                        setActionType('Approve');
                      }}
                      className="flex-1 lg:flex-none px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/10"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequest(req);
                        setActionType('Reject');
                      }}
                      className="flex-1 lg:flex-none px-6 py-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-bold rounded-2xl border border-rose-500/30 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {selectedRequest && actionType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-md relative"
            >
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setActionType(null);
                }}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white text-xl font-bold"
              >
                ✕
              </button>

              <h3 className="text-2xl font-black text-white mb-2">
                Confirm {actionType}
              </h3>
              <p className="text-sm text-zinc-400 mb-6">
                Are you sure you want to {actionType.toLowerCase()} the{' '}
                <span className="text-white font-bold">{selectedRequest.leaveType} leave</span>{' '}
                for employee <span className="text-pink-400 font-bold">{selectedRequest.employeeId}</span>?
              </p>

              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Admin Note (Optional)
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Provide feedback or justification..."
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl p-3 text-sm outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setActionType(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  className={`flex-1 py-3 rounded-xl text-black font-bold text-sm transition-all ${
                    actionType === 'Approve'
                      ? 'bg-emerald-500 hover:bg-emerald-400'
                      : 'bg-rose-500 hover:bg-rose-400 text-white'
                  }`}
                >
                  Confirm {actionType}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
