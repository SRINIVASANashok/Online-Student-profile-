import React from 'react';
import { ActiveView } from '../types';
import { RotateCcw, Plus } from 'lucide-react';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  studentCount: number;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  studentCount,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-6">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center shrink-0">
            <button
              id="brand-logo"
              type="button"
              onClick={() => setActiveView('directory')}
              className="text-left font-serif text-lg tracking-tight font-bold text-slate-900 hover:text-slate-800 cursor-pointer transition-colors"
            >
              Academic Registrar & Records
            </button>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-directory-tab"
              type="button"
              onClick={() => setActiveView('directory')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeView === 'directory'
                  ? 'text-slate-950 font-semibold bg-slate-100'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <span>Student Directory</span>
              <span className="ml-1.5 text-slate-400 font-mono text-[11px] tabular-nums">
                ({studentCount})
              </span>
            </button>

            <button
              id="nav-calculator-tab"
              type="button"
              onClick={() => setActiveView('calculator')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeView === 'calculator'
                  ? 'text-slate-950 font-semibold bg-slate-100'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              Audit & GPA Calculator
            </button>
          </nav>

          {/* Zone 3: Primary action + archive/reset utility */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-reset-demo-data"
              type="button"
              onClick={onResetData}
              title="Reset sample student records"
              className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 px-2 py-1 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset Records</span>
            </button>

            <button
              id="nav-add-student-tab"
              type="button"
              onClick={() => setActiveView('form')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors whitespace-nowrap shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Student</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
