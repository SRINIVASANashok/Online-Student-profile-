import React, { useState, useMemo } from 'react';
import { FilterState, Student } from '../types';
import { POPULAR_DEPARTMENTS } from '../utils/academicUtils';
import { 
  Search, 
  LayoutGrid, 
  Table as TableIcon, 
  ArrowUpDown, 
  ExternalLink, 
  Edit2, 
  Trash2,
  AlertCircle
} from 'lucide-react';

interface StudentDirectoryProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onAddNew: () => void;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  students,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  onAddNew,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    department: 'all',
    semester: 'all',
    standing: 'all',
    minCgpa: 0,
    sortBy: 'name-asc',
  });

  // Institutional registry metrics
  const stats = useMemo(() => {
    if (students.length === 0) return { total: 0, avgCgpa: 0, honorsCount: 0, attendanceAlerts: 0 };
    const total = students.length;
    const avgCgpa = students.reduce((sum, s) => sum + s.cgpa, 0) / total;
    const honorsCount = students.filter(s => s.cgpa >= 3.5).length;
    const attendanceAlerts = students.filter(s => s.attendanceRate < 75).length;
    return {
      total,
      avgCgpa: Math.round(avgCgpa * 100) / 100,
      honorsCount,
      attendanceAlerts,
    };
  }, [students]);

  // Filtering & Sorting
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesName = student.fullName.toLowerCase().includes(query);
        const matchesId = student.studentId.toLowerCase().includes(query);
        const matchesEmail = student.email.toLowerCase().includes(query);
        const matchesDept = student.department.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesEmail && !matchesDept) {
          return false;
        }
      }

      if (filters.department !== 'all' && student.department !== filters.department) {
        return false;
      }

      if (filters.semester !== 'all' && student.currentSemester.toString() !== filters.semester) {
        return false;
      }

      if (filters.standing !== 'all') {
        if (filters.standing === 'honors' && student.cgpa < 3.5) return false;
        if (filters.standing === 'probation' && student.cgpa >= 2.0) return false;
        if (filters.standing === 'good' && (student.cgpa < 2.0 || student.cgpa >= 3.5)) return false;
      }

      if (filters.minCgpa > 0 && student.cgpa < filters.minCgpa) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'name-asc':
          return a.fullName.localeCompare(b.fullName);
        case 'name-desc':
          return b.fullName.localeCompare(a.fullName);
        case 'cgpa-desc':
          return b.cgpa - a.cgpa;
        case 'cgpa-asc':
          return a.cgpa - b.cgpa;
        case 'studentId-asc':
          return a.studentId.localeCompare(b.studentId);
        case 'attendance-desc':
          return b.attendanceRate - a.attendanceRate;
        default:
          return 0;
      }
    });
  }, [students, filters]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      department: 'all',
      semester: 'all',
      standing: 'all',
      minCgpa: 0,
      sortBy: 'name-asc',
    });
  };

  const isFilteringActive = Boolean(
    filters.searchQuery || 
    filters.department !== 'all' || 
    filters.semester !== 'all' || 
    filters.standing !== 'all'
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Page Title & Institutional Overview */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-950">
          Student Academic Directory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Active undergraduate matriculations, academic standings, and departmental records
        </p>
      </div>

      {/* Institutional Metrics Ledger Bar */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <div className="p-4">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              Active Records
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-900 font-mono tabular-nums">
                {stats.total}
              </span>
              <span className="text-[11px] text-slate-400">matriculated</span>
            </div>
          </div>

          <div className="p-4">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              Mean CGPA
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-900 font-mono tabular-nums">
                {stats.avgCgpa.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-400">/ 4.00 standard</span>
            </div>
          </div>

          <div className="p-4">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              Honors Standing
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-900 font-mono tabular-nums">
                {stats.honorsCount}
              </span>
              <span className="text-[11px] text-slate-400">
                ({stats.total > 0 ? Math.round((stats.honorsCount / stats.total) * 100) : 0}%)
              </span>
            </div>
          </div>

          <div className="p-4">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              Attendance Review
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`text-2xl font-semibold font-mono tabular-nums ${stats.attendanceAlerts > 0 ? 'text-amber-800' : 'text-slate-900'}`}>
                {stats.attendanceAlerts}
              </span>
              <span className="text-[11px] text-slate-400">below 75% threshold</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter & Controls Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="input-search-students"
              type="text"
              placeholder="Search by student name, roll number, department, or email..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-9 pr-14 py-1.5 text-xs rounded border border-slate-300 bg-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Toggles & Add Action */}
          <div className="flex items-center gap-2 justify-end shrink-0">
            {/* Segmented Grid/Table Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200">
              <button
                id="btn-view-grid"
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Card Layout"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                id="btn-view-table"
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tabular Ledger"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ledger</span>
              </button>
            </div>

            <button
              id="btn-add-new-student-action"
              type="button"
              onClick={onAddNew}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors whitespace-nowrap"
            >
              + Add Record
            </button>
          </div>
        </div>

        {/* Filter Selectors Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Filters:
          </span>

          <select
            id="filter-department"
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:border-slate-800"
          >
            <option value="all">All Departments</option>
            {POPULAR_DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            id="filter-semester"
            value={filters.semester}
            onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
            className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:border-slate-800"
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem.toString()}>Semester {sem}</option>
            ))}
          </select>

          <select
            id="filter-standing"
            value={filters.standing}
            onChange={(e) => setFilters(prev => ({ ...prev, standing: e.target.value }))}
            className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:border-slate-800"
          >
            <option value="all">All Academic Standings</option>
            <option value="honors">Honors (CGPA ≥ 3.5)</option>
            <option value="good">Good Standing (2.0 – 3.49)</option>
            <option value="probation">Academic Probation (&lt; 2.0)</option>
          </select>

          <div className="ml-auto flex items-center gap-1.5">
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <select
              id="filter-sort-by"
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:border-slate-800"
            >
              <option value="name-asc">Sort: Name (A–Z)</option>
              <option value="name-desc">Sort: Name (Z–A)</option>
              <option value="cgpa-desc">Sort: CGPA (High to Low)</option>
              <option value="cgpa-asc">Sort: CGPA (Low to High)</option>
              <option value="studentId-asc">Sort: Student ID</option>
              <option value="attendance-desc">Sort: Attendance (High to Low)</option>
            </select>
          </div>

          {isFilteringActive && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-slate-600 hover:text-slate-900 font-medium underline ml-1"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Directory Content: Grid or Ledger Table */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <p className="font-serif text-lg font-semibold text-slate-900">
            No Student Records Match
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
            {isFilteringActive
              ? 'No enrolled student records fulfill the current criteria. Reset or broaden the query filters.'
              : 'The student registry is currently empty. Use the registration action to enroll a student.'}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {isFilteringActive && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                Clear Filters
              </button>
            )}
            <button
              type="button"
              onClick={onAddNew}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
            >
              Register New Student
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const isAttendanceWarning = student.attendanceRate < 75;

            return (
              <div
                key={student.id}
                id={`student-card-${student.id}`}
                className="bg-white border border-slate-200 rounded-lg hover:border-slate-400 transition-colors flex flex-col justify-between overflow-hidden group shadow-2xs"
              >
                <div className="p-4">
                  {/* Top identification bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {student.avatarUrl ? (
                        <img
                          src={student.avatarUrl}
                          alt={student.fullName}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                      <div className={`w-11 h-11 rounded bg-slate-100 text-slate-700 font-serif font-semibold text-sm flex items-center justify-center border border-slate-200 shrink-0 ${student.avatarUrl ? 'hidden' : 'flex'}`}>
                        {student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onSelectStudent(student)}
                          className="text-left font-serif text-base font-semibold text-slate-900 hover:underline block truncate"
                        >
                          {student.fullName}
                        </button>
                        <span className="font-mono text-xs text-slate-500 tabular-nums">
                          {student.studentId}
                        </span>
                      </div>
                    </div>

                    {/* CGPA display */}
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                        CGPA
                      </span>
                      <span className="text-base font-semibold font-mono tabular-nums text-slate-950">
                        {student.cgpa.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Academic metadata - clean text with separators, ZERO pills */}
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                    <p className="font-medium text-slate-800 truncate">
                      {student.department}
                    </p>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] truncate">
                      <span>Sem {student.currentSemester}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="truncate">{student.degree.split('(')[0].trim()}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="font-mono tabular-nums">{student.courses.length} courses</span>
                    </div>
                  </div>

                  {/* Status & Attendance Row */}
                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-700 font-medium">
                      {student.standing}
                    </span>

                    <span className={`text-[11px] font-mono tabular-nums flex items-center gap-1 ${
                      isAttendanceWarning ? 'text-amber-800 font-medium' : 'text-slate-500'
                    }`}>
                      {isAttendanceWarning && <AlertCircle className="w-3 h-3 text-amber-700" />}
                      <span>{student.attendanceRate}% Attendance</span>
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50 border-t border-slate-100 px-3.5 py-2 flex items-center justify-between gap-2 text-xs">
                  <button
                    id={`btn-view-profile-${student.id}`}
                    type="button"
                    onClick={() => onSelectStudent(student)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-950 transition-colors"
                  >
                    <span>View Dossier</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      id={`btn-edit-student-${student.id}`}
                      type="button"
                      onClick={() => onEditStudent(student)}
                      title="Edit student record"
                      className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-200/60 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      id={`btn-delete-student-${student.id}`}
                      type="button"
                      onClick={() => onDeleteStudent(student)}
                      title="Delete profile record"
                      className="p-1 text-slate-400 hover:text-rose-700 rounded hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High-Density Tabular Ledger */
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Student Name & ID</th>
                  <th className="py-2.5 px-3">Department & Degree</th>
                  <th className="py-2.5 px-3 text-center">Semester</th>
                  <th className="py-2.5 px-3 text-right">CGPA</th>
                  <th className="py-2.5 px-3">Standing</th>
                  <th className="py-2.5 px-3 text-right">Attendance</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const isAttendanceWarning = student.attendanceRate < 75;

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          {student.avatarUrl ? (
                            <img
                              src={student.avatarUrl}
                              alt={student.fullName}
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded object-cover border border-slate-200 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 font-serif font-semibold text-[11px] flex items-center justify-center border border-slate-200 shrink-0">
                              {student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <button
                              type="button"
                              onClick={() => onSelectStudent(student)}
                              className="text-left font-serif font-semibold text-slate-900 hover:underline block"
                            >
                              {student.fullName}
                            </button>
                            <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                              {student.studentId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <p className="font-medium text-slate-800">{student.department}</p>
                        <p className="text-[11px] text-slate-500">{student.degree}</p>
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-700">
                        Sem {student.currentSemester}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {student.cgpa.toFixed(2)}
                      </td>

                      <td className="py-2.5 px-3 text-slate-700 font-medium">
                        {student.standing}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        <span className={isAttendanceWarning ? 'text-amber-800 font-semibold' : 'text-slate-600'}>
                          {student.attendanceRate}%
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectStudent(student)}
                            className="px-2 py-1 text-[11px] font-medium text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                          >
                            Dossier
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditStudent(student)}
                            title="Edit"
                            className="p-1 text-slate-500 hover:text-slate-900 rounded transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteStudent(student)}
                            title="Delete"
                            className="p-1 text-slate-400 hover:text-rose-700 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
