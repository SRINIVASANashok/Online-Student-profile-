import React, { useRef } from 'react';
import { Student } from '../types';
import { 
  GRADE_DESCRIPTIONS, 
  GRADE_POINTS 
} from '../utils/academicUtils';
import { 
  ArrowLeft, 
  Printer, 
  Edit3, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  UserCheck, 
  Award, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface StudentProfileViewProps {
  student: Student;
  onBack: () => void;
  onEdit: (student: Student) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  onBack,
  onEdit,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const isAttendanceLow = student.attendanceRate < 75;

  const handlePrint = () => {
    window.print();
  };

  // Transcript calculations
  const totalCourseCredits = student.courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  const totalQualityPoints = student.courses.reduce((sum, c) => {
    const pts = GRADE_POINTS[c.grade] ?? 0;
    return sum + (c.credits * pts);
  }, 0);
  const computedTermGpa = totalCourseCredits > 0 ? totalQualityPoints / totalCourseCredits : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          id="btn-back-to-directory"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-950 bg-white border border-slate-200 rounded transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="btn-print-profile"
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Official Transcript</span>
          </button>

          <button
            id="btn-edit-student-profile"
            type="button"
            onClick={() => onEdit(student)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Record</span>
          </button>
        </div>
      </div>

      {/* Official Academic Dossier Document Sheet */}
      <div 
        ref={printRef} 
        className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs print:border-none print:shadow-none"
      >
        {/* Institutional Header & Registrar Watermark Bar */}
        <div className="border-b border-slate-200 p-6 sm:p-8 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-[10px] tracking-widest font-semibold uppercase text-slate-500">
                OFFICE OF THE REGISTRAR · STUDENT INFORMATION SYSTEM
              </p>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-950 mt-0.5">
                Official Student Academic Dossier
              </h1>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                RECORD IDENTIFIER
              </span>
              <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
                REG-{student.studentId}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Verified: {new Date(student.updatedAt || student.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Student Identity Section */}
          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Student Portrait */}
            <div className="relative shrink-0">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.fullName}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded object-cover border border-slate-300 shadow-2xs"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}
              <div className={`w-24 h-24 rounded bg-slate-100 text-slate-700 font-serif font-bold text-2xl flex items-center justify-center border border-slate-300 shadow-2xs ${student.avatarUrl ? 'hidden' : 'flex'}`}>
                {student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Core Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="font-serif text-2xl font-bold text-slate-950 tracking-tight">
                  {student.fullName}
                </h2>
                <span className="font-mono text-xs font-semibold text-slate-600 tabular-nums">
                  {student.studentId}
                </span>
              </div>

              <p className="text-xs font-medium text-slate-700 mt-1">
                {student.degree} — {student.department}
              </p>

              {/* Clean metadata line with typographic middle dots */}
              <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
                <span>Semester {student.currentSemester}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Matriculated {student.enrollmentYear}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Gender: {student.gender}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>DOB: {student.dateOfBirth}</span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-[11px]">{student.email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-[11px]">{student.phone}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student.address.city}, {student.address.state}</span>
                </span>
              </div>
            </div>

            {/* Cumulative CGPA block */}
            <div className="w-full sm:w-auto p-4 bg-white border border-slate-200 rounded text-center shrink-0 min-w-[130px]">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Cumulative CGPA
              </span>
              <span className="text-3xl font-semibold font-mono tabular-nums text-slate-950 block mt-0.5">
                {student.cgpa.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {student.standing}
              </span>
            </div>
          </div>
        </div>

        {/* Academic Standing & Credit Summary Ledger */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-200 bg-white divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <div className="p-4">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
              Official Standing
            </span>
            <p className="font-serif font-semibold text-slate-900 text-sm mt-1">
              {student.standing}
            </p>
            <span className="text-[11px] text-slate-500 block mt-0.5">Standard 4.0 Scale</span>
          </div>

          <div className="p-4">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
              Total Credits Earned
            </span>
            <p className="font-mono font-semibold text-slate-900 text-sm mt-1 tabular-nums">
              {student.totalCreditsEarned} Credits
            </p>
            <span className="text-[11px] text-slate-500 block mt-0.5">Degree Req: 120 Units</span>
          </div>

          <div className="p-4">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
              Attendance Record
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`font-mono font-semibold text-sm tabular-nums ${isAttendanceLow ? 'text-amber-800' : 'text-slate-900'}`}>
                {student.attendanceRate}%
              </span>
              {isAttendanceLow && <AlertCircle className="w-3.5 h-3.5 text-amber-700" />}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {isAttendanceLow ? 'Under attendance review' : 'Satisfies residency threshold'}
            </span>
          </div>

          <div className="p-4">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
              Active Registered Units
            </span>
            <p className="font-mono font-semibold text-slate-900 text-sm mt-1 tabular-nums">
              {totalCourseCredits} Semester Units
            </p>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {student.courses.length} courses enrolled
            </span>
          </div>
        </div>

        {/* Official Transcript Course History */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h3 className="font-serif text-base font-bold text-slate-950">
                Current Semester Course Ledger & Grades
              </h3>
              <p className="text-[11px] text-slate-500">
                Official course registrations, credit values, and assigned letter grades
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 tabular-nums">
              Term GPA: {computedTermGpa.toFixed(2)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-2 px-3">Course Code</th>
                  <th className="py-2 px-3">Course Title</th>
                  <th className="py-2 px-3 text-center">Credit Units</th>
                  <th className="py-2 px-3 text-center">Grade</th>
                  <th className="py-2 px-3 text-right">Grade Points</th>
                  <th className="py-2 px-3 text-right">Quality Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {student.courses.map((course) => {
                  const pts = GRADE_POINTS[course.grade] ?? 0;
                  const qp = course.credits * pts;
                  return (
                    <tr key={course.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-900 tabular-nums">
                        {course.code}
                      </td>
                      <td className="py-2.5 px-3 text-slate-800">
                        {course.name}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-600">
                        {course.credits}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-900">
                        {course.grade}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600 tabular-nums">
                        {pts.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-900 tabular-nums">
                        {qp.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 font-semibold text-slate-900 bg-slate-50/60">
                  <td colSpan={2} className="py-2.5 px-3 text-right">
                    Semester Totals:
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono tabular-nums">
                    {totalCourseCredits}
                  </td>
                  <td className="py-2.5 px-3"></td>
                  <td className="py-2.5 px-3 text-right text-slate-500 font-normal text-[11px]">
                    Term GPA:
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-950 font-bold">
                    {computedTermGpa.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Personal & Registry Records Grid */}
        <div className="border-t border-slate-200 p-6 sm:p-8 bg-slate-50/30">
          <h3 className="font-serif text-base font-bold text-slate-950 mb-3">
            Personal Registry & Contact Dossier
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Residential & Contact */}
            <div className="border border-slate-200 rounded p-4 bg-white space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Primary Residence & Mailing Address
              </span>
              <p className="font-medium text-slate-900">
                {student.address.street || 'Address not registered'}
              </p>
              <p className="text-slate-600">
                {student.address.city}, {student.address.state} {student.address.zipCode}
              </p>
              <div className="pt-2 border-t border-slate-100 space-y-1 text-slate-600">
                <p><span className="text-slate-400">Official Email:</span> {student.email}</p>
                <p><span className="text-slate-400">Phone:</span> {student.phone}</p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border border-slate-200 rounded p-4 bg-white space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Designated Emergency Contact
              </span>
              <p className="font-medium text-slate-900">
                {student.emergencyContact.name || 'Not provided'}
              </p>
              <p className="text-slate-600">
                Relationship: {student.emergencyContact.relationship || 'Guardian'}
              </p>
              <div className="pt-2 border-t border-slate-100 text-slate-600">
                <p><span className="text-slate-400">Emergency Phone:</span> {student.emergencyContact.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Academic Bio & Skills */}
          {(student.bio || (student.skills && student.skills.length > 0)) && (
            <div className="mt-4 border border-slate-200 rounded p-4 bg-white text-xs space-y-3">
              {student.bio && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Academic Summary & Research Interests
                  </span>
                  <p className="text-slate-700 mt-1 leading-relaxed">
                    {student.bio}
                  </p>
                </div>
              )}

              {student.skills && student.skills.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Documented Competencies
                  </span>
                  <p className="text-slate-700">
                    {student.skills.join(' · ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Official Certification Signature Block */}
        <div className="border-t border-slate-200 p-6 sm:p-8 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-slate-500">
          <div>
            <p className="font-serif font-semibold text-slate-800">
              Office of Academic Records & Registration
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              This document represents an official certified electronic copy of academic standing.
            </p>
          </div>

          <div className="border-t sm:border-t-0 sm:border-l border-slate-300 sm:pl-6 pt-3 sm:pt-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
              REGISTRAR AUTHENTICATION
            </span>
            <span className="font-serif text-sm italic font-semibold text-slate-900 block mt-0.5">
              Academic Registry Attestation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
