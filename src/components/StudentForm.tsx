import React, { useState } from 'react';
import { Course, Student } from '../types';
import { 
  calculateGPA, 
  calculateTotalCredits, 
  DEGREES, 
  getAcademicStanding, 
  POPULAR_DEPARTMENTS, 
  validateStudent, 
  ValidationErrors 
} from '../utils/academicUtils';
import { 
  Plus, 
  Trash2, 
  Save, 
  AlertCircle,
  BookOpen,
  User,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

interface StudentFormProps {
  initialStudent?: Student | null;
  existingStudents: Student[];
  onSave: (student: Student) => void;
  onCancel: () => void;
}

const DEFAULT_COURSE: Course = {
  id: '',
  code: '',
  name: '',
  credits: 3,
  grade: 'A',
};

export const StudentForm: React.FC<StudentFormProps> = ({
  initialStudent,
  existingStudents,
  onSave,
  onCancel,
}) => {
  const isEditing = !!initialStudent;

  // Form State
  const [formData, setFormData] = useState<Partial<Student>>(() => {
    if (initialStudent) {
      return { ...initialStudent };
    }
    return {
      studentId: '',
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '2003-01-01',
      gender: 'Female',
      avatarUrl: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      emergencyContact: {
        name: '',
        relationship: 'Parent',
        phone: '',
      },
      department: POPULAR_DEPARTMENTS[0],
      degree: DEGREES[0],
      enrollmentYear: new Date().getFullYear(),
      currentSemester: 1,
      courses: [
        { id: 'init-1', code: 'CS101', name: 'Intro to Computer Science', credits: 4, grade: 'A' },
        { id: 'init-2', code: 'MATH101', name: 'Calculus & Analytic Geometry', credits: 4, grade: 'B+' },
        { id: 'init-3', code: 'ENG105', name: 'Technical Communications', credits: 3, grade: 'A-' },
      ],
      attendanceRate: 92,
      bio: '',
      skills: ['Problem Solving', 'Python'],
    };
  });

  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Dynamic calculations in real time
  const currentCourses = formData.courses || [];
  const calculatedGpa = calculateGPA(currentCourses);
  const totalCredits = calculateTotalCredits(currentCourses);
  const calculatedStanding = getAcademicStanding(calculatedGpa);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddressChange = (subField: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        street: prev.address?.street || '',
        city: prev.address?.city || '',
        state: prev.address?.state || '',
        zipCode: prev.address?.zipCode || '',
        [subField]: value,
      },
    }));
  };

  const handleEmergencyChange = (subField: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        name: prev.emergencyContact?.name || '',
        relationship: prev.emergencyContact?.relationship || '',
        phone: prev.emergencyContact?.phone || '',
        [subField]: value,
      },
    }));
  };

  // Course handlers
  const handleCourseChange = (index: number, field: keyof Course, value: any) => {
    const updated = [...(formData.courses || [])];
    updated[index] = {
      ...updated[index],
      [field]: field === 'credits' ? Math.max(1, Math.min(6, Number(value) || 1)) : value,
    };
    setFormData((prev) => ({ ...prev, courses: updated }));
    if (errors.courses) {
      setErrors((prev) => ({ ...prev, courses: undefined }));
    }
  };

  const handleAddCourse = () => {
    const newCourse: Course = {
      ...DEFAULT_COURSE,
      id: `course-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      code: '',
      name: '',
    };
    setFormData((prev) => ({
      ...prev,
      courses: [...(prev.courses || []), newCourse],
    }));
  };

  const handleRemoveCourse = (index: number) => {
    const updated = (formData.courses || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, courses: updated }));
  };

  // Skills handlers
  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    const current = formData.skills || [];
    if (!current.includes(skillInput.trim())) {
      setFormData((prev) => ({ ...prev, skills: [...current, skillInput.trim()] }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((s) => s !== skillToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateStudent(
      formData,
      existingStudents,
      initialStudent?.id
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    const finalStudent: Student = {
      id: initialStudent?.id || `stu-${Date.now()}`,
      studentId: (formData.studentId || '').trim().toUpperCase(),
      fullName: (formData.fullName || '').trim(),
      email: (formData.email || '').trim().toLowerCase(),
      phone: (formData.phone || '').trim(),
      dateOfBirth: formData.dateOfBirth || '',
      gender: formData.gender || 'Prefer not to say',
      avatarUrl: (formData.avatarUrl || '').trim() || undefined,
      address: {
        street: (formData.address?.street || '').trim(),
        city: (formData.address?.city || '').trim(),
        state: (formData.address?.state || '').trim(),
        zipCode: (formData.address?.zipCode || '').trim(),
      },
      emergencyContact: {
        name: (formData.emergencyContact?.name || '').trim(),
        relationship: (formData.emergencyContact?.relationship || '').trim(),
        phone: (formData.emergencyContact?.phone || '').trim(),
      },
      department: formData.department || POPULAR_DEPARTMENTS[0],
      degree: formData.degree || DEGREES[0],
      enrollmentYear: Number(formData.enrollmentYear) || new Date().getFullYear(),
      currentSemester: Number(formData.currentSemester) || 1,
      courses: currentCourses,
      cgpa: calculatedGpa,
      totalCreditsEarned: totalCredits + (initialStudent?.totalCreditsEarned ? Math.max(0, initialStudent.totalCreditsEarned - totalCredits) : 40),
      attendanceRate: Number(formData.attendanceRate) || 85,
      standing: calculatedStanding,
      bio: (formData.bio || '').trim(),
      skills: formData.skills || [],
      createdAt: initialStudent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(finalStudent);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-950">
            {isEditing ? 'Modify Student Record' : 'New Matriculation Registration'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registrar academic credentials and personal dossier verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-cancel-form"
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-save-student"
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Save Changes' : 'Confirm Registration'}</span>
          </button>
        </div>
      </div>

      {/* Real-time GPA Audit Preview Box */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            DEGREE AUDIT · LIVE COMPUTATION
          </span>
          <p className="text-xs font-medium text-slate-800 mt-0.5">
            Computed from {currentCourses.length} enrolled courses and {totalCredits} semester credit units
          </p>
        </div>

        <div className="flex items-center gap-6 sm:text-right">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
              Calculated Term GPA
            </span>
            <span className="text-2xl font-semibold font-mono tabular-nums text-slate-950">
              {calculatedGpa.toFixed(2)}
            </span>
          </div>

          <div className="border-l border-slate-200 pl-4">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
              Academic Standing
            </span>
            <span className="text-xs font-semibold text-slate-900 font-serif">
              {calculatedStanding}
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Identification & Demographics */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
        <h2 className="font-serif text-base font-bold text-slate-950 border-b border-slate-100 pb-2">
          1. Student Legal Identification & Contact
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label htmlFor="input-student-id" className="block font-medium text-slate-700 mb-1">
              Student ID / Matriculation Roll <span className="text-rose-600">*</span>
            </label>
            <input
              id="input-student-id"
              type="text"
              placeholder="e.g. CS-2024-042"
              value={formData.studentId || ''}
              onChange={(e) => handleFieldChange('studentId', e.target.value)}
              className={`w-full px-3 py-1.5 rounded border ${
                errors.studentId ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
              } text-xs font-mono focus:outline-none focus:border-slate-900`}
            />
            {errors.studentId && (
              <p className="text-rose-600 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.studentId}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="input-full-name" className="block font-medium text-slate-700 mb-1">
              Full Legal Name <span className="text-rose-600">*</span>
            </label>
            <input
              id="input-full-name"
              type="text"
              placeholder="e.g. Eleanor Vance"
              value={formData.fullName || ''}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              className={`w-full px-3 py-1.5 rounded border ${
                errors.fullName ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
              } text-xs focus:outline-none focus:border-slate-900`}
            />
            {errors.fullName && (
              <p className="text-rose-600 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="input-email" className="block font-medium text-slate-700 mb-1">
              Official University Email <span className="text-rose-600">*</span>
            </label>
            <input
              id="input-email"
              type="email"
              placeholder="student@university.edu"
              value={formData.email || ''}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className={`w-full px-3 py-1.5 rounded border ${
                errors.email ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
              } text-xs font-mono focus:outline-none focus:border-slate-900`}
            />
            {errors.email && (
              <p className="text-rose-600 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="input-phone" className="block font-medium text-slate-700 mb-1">
              Phone Number <span className="text-rose-600">*</span>
            </label>
            <input
              id="input-phone"
              type="tel"
              placeholder="(555) 000-0000"
              value={formData.phone || ''}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              className={`w-full px-3 py-1.5 rounded border ${
                errors.phone ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
              } text-xs font-mono focus:outline-none focus:border-slate-900`}
            />
            {errors.phone && (
              <p className="text-rose-600 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="input-dob" className="block font-medium text-slate-700 mb-1">
              Date of Birth <span className="text-rose-600">*</span>
            </label>
            <input
              id="input-dob"
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
              className={`w-full px-3 py-1.5 rounded border ${
                errors.dateOfBirth ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
              } text-xs font-mono focus:outline-none focus:border-slate-900`}
            />
          </div>

          <div>
            <label htmlFor="select-gender" className="block font-medium text-slate-700 mb-1">
              Gender Demographics
            </label>
            <select
              id="select-gender"
              value={formData.gender || 'Prefer not to say'}
              onChange={(e) => handleFieldChange('gender', e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs bg-white focus:outline-none focus:border-slate-900"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Academic Program & Degree Matriculation */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
        <h2 className="font-serif text-base font-bold text-slate-950 border-b border-slate-100 pb-2">
          2. Academic Program & Degree Matriculation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label htmlFor="select-department" className="block font-medium text-slate-700 mb-1">
              Academic Department <span className="text-rose-600">*</span>
            </label>
            <select
              id="select-department"
              value={formData.department || POPULAR_DEPARTMENTS[0]}
              onChange={(e) => handleFieldChange('department', e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs bg-white focus:outline-none focus:border-slate-900"
            >
              {POPULAR_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="select-degree" className="block font-medium text-slate-700 mb-1">
              Degree Designation <span className="text-rose-600">*</span>
            </label>
            <select
              id="select-degree"
              value={formData.degree || DEGREES[0]}
              onChange={(e) => handleFieldChange('degree', e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs bg-white focus:outline-none focus:border-slate-900"
            >
              {DEGREES.map((deg) => (
                <option key={deg} value={deg}>{deg}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="input-semester" className="block font-medium text-slate-700 mb-1">
              Current Semester Standing (1–8) <span className="text-rose-600">*</span>
            </label>
            <select
              id="input-semester"
              value={formData.currentSemester || 1}
              onChange={(e) => handleFieldChange('currentSemester', Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs bg-white focus:outline-none focus:border-slate-900 font-mono"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="input-attendance" className="block font-medium text-slate-700 mb-1">
              Attendance Record Rate (%) <span className="text-rose-600">*</span>
            </label>
            <input
              id="input-attendance"
              type="number"
              min="0"
              max="100"
              value={formData.attendanceRate ?? 85}
              onChange={(e) => handleFieldChange('attendanceRate', Number(e.target.value))}
              className={`w-full px-3 py-1.5 rounded border ${
                errors.attendanceRate ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
              } text-xs font-mono focus:outline-none focus:border-slate-900`}
            />
            {errors.attendanceRate && (
              <p className="text-rose-600 text-[11px] mt-1">{errors.attendanceRate}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Course Registration & Term Grades */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="font-serif text-base font-bold text-slate-950">
              3. Course Registration & Letter Grades
            </h2>
            <p className="text-[11px] text-slate-500">
              Course units and assigned grades dynamically calculate term GPA and academic honors
            </p>
          </div>

          <button
            id="btn-add-course"
            type="button"
            onClick={handleAddCourse}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Course</span>
          </button>
        </div>

        {errors.courses && (
          <p className="text-rose-600 text-xs flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.courses}</span>
          </p>
        )}

        <div className="space-y-2 text-xs">
          {currentCourses.map((course, idx) => (
            <div
              key={course.id || idx}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded border border-slate-200 bg-slate-50/50"
            >
              <div className="w-full sm:w-28 shrink-0">
                <input
                  type="text"
                  placeholder="Code (e.g. CS101)"
                  value={course.code}
                  onChange={(e) => handleCourseChange(idx, 'code', e.target.value.toUpperCase())}
                  className="w-full px-2 py-1 rounded border border-slate-300 bg-white text-xs font-mono focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  placeholder="Course Name / Title"
                  value={course.name}
                  onChange={(e) => handleCourseChange(idx, 'name', e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 bg-white text-xs focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="w-20">
                  <select
                    value={course.credits}
                    onChange={(e) => handleCourseChange(idx, 'credits', Number(e.target.value))}
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
                    onChange={(e) => handleCourseChange(idx, 'grade', e.target.value)}
                    className="w-full px-2 py-1 rounded border border-slate-300 bg-white text-xs font-mono font-semibold focus:outline-none focus:border-slate-900"
                  >
                    {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'].map(gr => (
                      <option key={gr} value={gr}>{gr}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveCourse(idx)}
                  disabled={currentCourses.length <= 1}
                  className={`p-1.5 rounded transition-colors ${
                    currentCourses.length <= 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-400 hover:text-rose-700 hover:bg-rose-50'
                  }`}
                  title="Remove course"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Residential Address & Emergency Contact */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
        <h2 className="font-serif text-base font-bold text-slate-950 border-b border-slate-100 pb-2">
          4. Residential Address & Emergency Registry
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-medium text-slate-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              placeholder="e.g. 452 University Ave, Apt 3B"
              value={formData.address?.street || ''}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              City
            </label>
            <input
              type="text"
              placeholder="e.g. Cambridge"
              value={formData.address?.city || ''}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                State / Province
              </label>
              <input
                type="text"
                placeholder="e.g. MA"
                value={formData.address?.state || ''}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Postal / ZIP
              </label>
              <input
                type="text"
                placeholder="02138"
                value={formData.address?.zipCode || ''}
                onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Emergency Contact Name
            </label>
            <input
              type="text"
              placeholder="e.g. Dr. Michael Chen"
              value={formData.emergencyContact?.name || ''}
              onChange={(e) => handleEmergencyChange('name', e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Emergency Phone Number
            </label>
            <input
              type="tel"
              placeholder="(555) 890-1234"
              value={formData.emergencyContact?.phone || ''}
              onChange={(e) => handleEmergencyChange('phone', e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Section 5: Academic Statement & Competencies */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
        <h2 className="font-serif text-base font-bold text-slate-950 border-b border-slate-100 pb-2">
          5. Academic Statement & Competencies
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Academic Bio & Research Interests
            </label>
            <textarea
              rows={3}
              placeholder="Summary of student's research focus, extracurricular leadership, or honors thesis..."
              value={formData.bio || ''}
              onChange={(e) => handleFieldChange('bio', e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 text-xs focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Documented Skills & Competencies
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Distributed Systems, Rust"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:border-slate-900"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                Add Skill
              </button>
            </div>

            {formData.skills && formData.skills.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-2xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Save Student Record' : 'Enroll Student'}</span>
        </button>
      </div>
    </form>
  );
};
