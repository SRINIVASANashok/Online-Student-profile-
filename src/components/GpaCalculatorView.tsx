import React, { useState } from 'react';
import { LetterGrade } from '../types';
import { 
  GRADE_POINTS, 
  GRADE_DESCRIPTIONS, 
  getAcademicStanding 
} from '../utils/academicUtils';
import { Plus, Trash2, RotateCcw, Target } from 'lucide-react';

interface CalcCourse {
  id: string;
  name: string;
  credits: number;
  grade: LetterGrade;
}

export const GpaCalculatorView: React.FC = () => {
  // Prior academic standing state
  const [priorCredits, setPriorCredits] = useState<number>(45);
  const [priorCgpa, setPriorCgpa] = useState<number>(3.40);

  // Term courses state
  const [courses, setCourses] = useState<CalcCourse[]>([
    { id: '1', name: 'Software Architecture & Systems', credits: 4, grade: 'A' },
    { id: '2', name: 'Database Management Systems', credits: 4, grade: 'A-' },
    { id: '3', name: 'Linear Algebra & Numerical Methods', credits: 3, grade: 'B+' },
    { id: '4', name: 'Distributed Cloud Infrastructure', credits: 3, grade: 'A' },
  ]);

  // Target Goal Planner State
  const [targetCgpa, setTargetCgpa] = useState<number>(3.70);
  const [upcomingCredits, setUpcomingCredits] = useState<number>(15);

  // Term Calculations
  const termTotalCredits = courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);
  const termQualityPoints = courses.reduce((acc, c) => {
    const pts = GRADE_POINTS[c.grade] ?? 0;
    return acc + (c.credits * pts);
  }, 0);

  const termGpa = termTotalCredits > 0 ? termQualityPoints / termTotalCredits : 0;
  const termStanding = getAcademicStanding(termGpa);

  // Projected Cumulative CGPA
  const totalCombinedCredits = priorCredits + termTotalCredits;
  const priorQualityPoints = priorCredits * priorCgpa;
  const projectedCumulativeQualityPoints = priorQualityPoints + termQualityPoints;
  const projectedCgpa = totalCombinedCredits > 0 ? projectedCumulativeQualityPoints / totalCombinedCredits : 0;
  const projectedStanding = getAcademicStanding(projectedCgpa);

  // Goal calculation:
  // Target Quality Points = (priorCredits + upcomingCredits) * targetCgpa
  // Required Term QP = Target QP - priorQualityPoints
  // Required Term GPA = Required Term QP / upcomingCredits
  const targetRequiredTotalQP = (priorCredits + upcomingCredits) * targetCgpa;
  const targetRequiredTermQP = targetRequiredTotalQP - (priorCredits * priorCgpa);
  const requiredTermGpa = upcomingCredits > 0 ? targetRequiredTermQP / upcomingCredits : 0;

  const handleAddCourse = () => {
    const newId = `calc-${Date.now()}`;
    setCourses([...courses, { id: newId, name: `Elective Course ${courses.length + 1}`, credits: 3, grade: 'A' }]);
  };

  const handleRemoveCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const handleCourseChange = (id: string, field: keyof CalcCourse, value: any) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        return {
          ...c,
          [field]: field === 'credits' ? Math.max(1, Math.min(10, Number(value) || 1)) : value,
        };
      }
      return c;
    }));
  };

  const handleReset = () => {
    setPriorCredits(45);
    setPriorCgpa(3.40);
    setCourses([
      { id: '1', name: 'Software Architecture & Systems', credits: 4, grade: 'A' },
      { id: '2', name: 'Database Management Systems', credits: 4, grade: 'A-' },
      { id: '3', name: 'Linear Algebra & Numerical Methods', credits: 3, grade: 'B+' },
      { id: '4', name: 'Distributed Cloud Infrastructure', credits: 3, grade: 'A' },
    ]);
    setTargetCgpa(3.70);
    setUpcomingCredits(15);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-950">
            Degree Audit & GPA Projection Workbench
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulate term course grades, compute cumulative CGPA trajectory, and evaluate target degree requirements
          </p>
        </div>

        <button
          id="btn-reset-calculator"
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded transition-colors shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Projection Metric Ledger Bar */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Term Semester GPA */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Simulated Term GPA
              </span>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {termTotalCredits} Credits
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold font-mono tabular-nums text-slate-950">
                {termGpa.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-400">/ 4.00 standard</span>
            </div>
            <span className="text-xs font-serif font-medium text-slate-700 block mt-1">
              {termStanding}
            </span>
          </div>

          {/* Projected Cumulative CGPA */}
          <div className="p-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Projected Cumulative CGPA
              </span>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {totalCombinedCredits} Total Credits
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold font-mono tabular-nums text-slate-950">
                {projectedCgpa.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-400">/ 4.00 standard</span>
            </div>
            <span className="text-xs font-serif font-medium text-slate-700 block mt-1">
              Projected: {projectedStanding}
            </span>
          </div>

          {/* Target Required GPA */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Target GPA Required
              </span>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                Goal: {targetCgpa.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-3xl font-semibold font-mono tabular-nums ${
                requiredTermGpa > 4.0 ? 'text-amber-800' : 'text-slate-950'
              }`}>
                {requiredTermGpa <= 0 ? '0.00' : requiredTermGpa.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-400">needed next term</span>
            </div>
            <span className="text-xs text-slate-500 block mt-1">
              {requiredTermGpa > 4.0
                ? 'Mathematically unattainable in single term'
                : `Over next ${upcomingCredits} credits`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Simulated Courses Ledger */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="font-serif text-base font-bold text-slate-950">
                Simulated Course Registrations
              </h2>
              <p className="text-[11px] text-slate-500">
                Adjust credit units and anticipated letter grades to evaluate performance outcomes
              </p>
            </div>

            <button
              id="btn-calc-add-course"
              type="button"
              onClick={handleAddCourse}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {courses.map((course) => {
              const pts = GRADE_POINTS[course.grade] ?? 0;
              const qp = course.credits * pts;

              return (
                <div
                  key={course.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded border border-slate-200 bg-slate-50/40"
                >
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => handleCourseChange(course.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 rounded border border-slate-300 bg-white text-xs focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-20">
                      <select
                        value={course.credits}
                        onChange={(e) => handleCourseChange(course.id, 'credits', Number(e.target.value))}
                        className="w-full px-2 py-1 rounded border border-slate-300 bg-white text-xs font-mono focus:outline-none focus:border-slate-900"
                      >
                        {[1, 2, 3, 4, 5, 6].map(cr => (
                          <option key={cr} value={cr}>{cr} Units</option>
                        ))}
                      </select>
                    </div>

                    <div className="w-20">
                      <select
                        value={course.grade}
                        onChange={(e) => handleCourseChange(course.id, 'grade', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-300 bg-white text-xs font-mono font-semibold focus:outline-none focus:border-slate-900"
                      >
                        {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'].map(gr => (
                          <option key={gr} value={gr}>{gr}</option>
                        ))}
                      </select>
                    </div>

                    <div className="w-16 text-right font-mono text-[11px] text-slate-500 tabular-nums">
                      {qp.toFixed(1)} QP
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveCourse(course.id)}
                      disabled={courses.length <= 1}
                      className={`p-1.5 rounded transition-colors ${
                        courses.length <= 1
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-400 hover:text-rose-700 hover:bg-rose-50'
                      }`}
                      title="Remove course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 font-mono tabular-nums">
            <span>Simulated Credits: {termTotalCredits}</span>
            <span>Total Quality Points: {termQualityPoints.toFixed(1)}</span>
          </div>
        </div>

        {/* Right Column: Historical Transcript Baseline & Target Planner */}
        <div className="space-y-4">
          {/* Baseline Academic History */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3 text-xs">
            <h3 className="font-serif text-sm font-bold text-slate-950 border-b border-slate-100 pb-1.5">
              Prior Transcript Baseline
            </h3>
            <p className="text-[11px] text-slate-500">
              Completed credit units and current cumulative CGPA prior to this term
            </p>

            <div className="space-y-2.5 pt-1">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Prior Completed Credits
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={priorCredits}
                  onChange={(e) => setPriorCredits(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-mono tabular-nums focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Prior Cumulative CGPA
                </label>
                <input
                  type="number"
                  min="0"
                  max="4.0"
                  step="0.01"
                  value={priorCgpa}
                  onChange={(e) => setPriorCgpa(Math.max(0, Math.min(4.0, Number(e.target.value) || 0)))}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-mono tabular-nums focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Goal Planner */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3 text-xs">
            <h3 className="font-serif text-sm font-bold text-slate-950 border-b border-slate-100 pb-1.5">
              Target Honors Threshold Planner
            </h3>

            <div className="space-y-2.5 pt-1">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Target Desired Cumulative CGPA
                </label>
                <input
                  type="number"
                  min="0"
                  max="4.0"
                  step="0.05"
                  value={targetCgpa}
                  onChange={(e) => setTargetCgpa(Math.max(0, Math.min(4.0, Number(e.target.value) || 0)))}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-mono tabular-nums focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Upcoming Semester Credit Units
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={upcomingCredits}
                  onChange={(e) => setUpcomingCredits(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-mono tabular-nums focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Standard 4.0 Scale Reference Table */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs text-xs space-y-2">
            <h4 className="font-serif text-xs font-bold text-slate-950 uppercase tracking-wider">
              Standard 4.0 Grading Matrix
            </h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600 font-mono tabular-nums">
              <span>A+ / A (4.0)</span>
              <span>B- (2.7)</span>
              <span>A- (3.7)</span>
              <span>C+ (2.3)</span>
              <span>B+ (3.3)</span>
              <span>C (2.0)</span>
              <span>B (3.0)</span>
              <span>F (0.0)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
