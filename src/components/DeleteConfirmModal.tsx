import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Student } from '../types';

interface DeleteConfirmModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  student,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="modal-delete-student"
        className="bg-white rounded-lg max-w-md w-full p-5 shadow-lg border border-slate-200"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <h3 className="font-serif text-base font-bold text-slate-950">
              Confirm Record Expungement
            </h3>
          </div>
          <button
            id="btn-close-delete-modal"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 text-xs text-slate-600 space-y-2">
          <p>
            Are you sure you want to permanently remove the academic dossier for{' '}
            <strong className="text-slate-950 font-semibold">{student.fullName}</strong> (Matriculation ID: {student.studentId})?
          </p>
          <p className="text-[11px] text-slate-500">
            This action will expunge all course enrollment logs, grade calculations, and transcript records from the database.
          </p>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
          <button
            id="btn-cancel-delete"
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-delete"
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-3.5 py-1.5 font-medium text-white bg-rose-700 hover:bg-rose-800 rounded transition-colors"
          >
            Expunge Record
          </button>
        </div>
      </div>
    </div>
  );
};
