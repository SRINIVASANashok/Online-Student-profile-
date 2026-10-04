import { AcademicStanding, Course, LetterGrade, Student } from '../types';

export const GRADE_POINTS: Record<LetterGrade, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D': 1.0,
  'F': 0.0,
};

export const GRADE_DESCRIPTIONS: Record<LetterGrade, { text: string; bg: string; textCol: string }> = {
  'A+': { text: 'Outstanding (4.0)', bg: 'bg-emerald-50 border-emerald-200', textCol: 'text-emerald-700' },
  'A': { text: 'Excellent (4.0)', bg: 'bg-emerald-50 border-emerald-200', textCol: 'text-emerald-700' },
  'A-': { text: 'Very Good (3.7)', bg: 'bg-teal-50 border-teal-200', textCol: 'text-teal-700' },
  'B+': { text: 'Good (3.3)', bg: 'bg-blue-50 border-blue-200', textCol: 'text-blue-700' },
  'B': { text: 'Above Average (3.0)', bg: 'bg-blue-50 border-blue-200', textCol: 'text-blue-700' },
  'B-': { text: 'Average (2.7)', bg: 'bg-cyan-50 border-cyan-200', textCol: 'text-cyan-700' },
  'C+': { text: 'Below Average (2.3)', bg: 'bg-amber-50 border-amber-200', textCol: 'text-amber-700' },
  'C': { text: 'Satisfactory (2.0)', bg: 'bg-amber-50 border-amber-200', textCol: 'text-amber-700' },
  'C-': { text: 'Marginal (1.7)', bg: 'bg-orange-50 border-orange-200', textCol: 'text-orange-700' },
  'D': { text: 'Poor (1.0)', bg: 'bg-rose-50 border-rose-200', textCol: 'text-rose-700' },
  'F': { text: 'Fail (0.0)', bg: 'bg-red-100 border-red-300', textCol: 'text-red-700' },
};

export function calculateGPA(courses: Course[]): number {
  if (!courses || courses.length === 0) return 0.0;
  
  let totalQualityPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    const credits = Number(course.credits) || 0;
    const gradePoint = GRADE_POINTS[course.grade] ?? 0;
    totalQualityPoints += credits * gradePoint;
    totalCredits += credits;
  }

  if (totalCredits === 0) return 0.0;
  const gpa = totalQualityPoints / totalCredits;
  return Math.round(gpa * 100) / 100;
}

export function calculateTotalCredits(courses: Course[]): number {
  if (!courses || courses.length === 0) return 0;
  return courses.reduce((sum, c) => {
    // Only count credits if not failed
    if (c.grade !== 'F') {
      return sum + (Number(c.credits) || 0);
    }
    return sum;
  }, 0);
}

export function getAcademicStanding(cgpa: number): AcademicStanding {
  if (cgpa >= 3.8) return "President's Honors";
  if (cgpa >= 3.5) return "Dean's List";
  if (cgpa >= 3.0) return "First Class Standing";
  if (cgpa >= 2.0) return "Good Standing";
  if (cgpa >= 1.5) return "Academic Warning";
  return "Academic Probation";
}

export function getStandingBadgeStyles(standing: AcademicStanding): { bg: string; text: string; border: string } {
  switch (standing) {
    case "President's Honors":
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    case "Dean's List":
      return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
    case "First Class Standing":
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case "Good Standing":
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case "Academic Warning":
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    case "Academic Probation":
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
}

export interface ValidationErrors {
  fullName?: string;
  studentId?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  department?: string;
  degree?: string;
  currentSemester?: string;
  attendanceRate?: string;
  courses?: string;
  emergencyName?: string;
  emergencyPhone?: string;
}

export function validateStudent(
  student: Partial<Student>,
  existingStudents: Student[],
  currentStudentId?: string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Full Name
  if (!student.fullName || student.fullName.trim().length < 3) {
    errors.fullName = 'Full Name is required and must be at least 3 characters.';
  } else if (!/^[a-zA-Z\s.'-]+$/.test(student.fullName.trim())) {
    errors.fullName = 'Full Name must only contain letters, spaces, and standard name symbols.';
  }

  // Student ID / Roll Number
  if (!student.studentId || student.studentId.trim().length === 0) {
    errors.studentId = 'Student ID / Roll Number is required.';
  } else {
    const trimmedId = student.studentId.trim().toUpperCase();
    const isDuplicate = existingStudents.some(
      s => s.studentId.toUpperCase() === trimmedId && s.id !== currentStudentId
    );
    if (isDuplicate) {
      errors.studentId = 'A student with this Student ID already exists.';
    }
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!student.email || student.email.trim().length === 0) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(student.email.trim())) {
    errors.email = 'Please provide a valid email address (e.g., student@university.edu).';
  }

  // Phone
  const phoneDigits = (student.phone || '').replace(/\D/g, '');
  if (!student.phone || student.phone.trim().length === 0) {
    errors.phone = 'Contact phone number is required.';
  } else if (phoneDigits.length < 10) {
    errors.phone = 'Phone number must contain at least 10 digits.';
  }

  // Date of Birth
  if (!student.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required.';
  } else {
    const birthDate = new Date(student.dateOfBirth);
    const now = new Date();
    const age = (now.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (isNaN(age) || age < 15) {
      errors.dateOfBirth = 'Student must be at least 15 years old.';
    } else if (age > 100) {
      errors.dateOfBirth = 'Please enter a realistic date of birth.';
    }
  }

  // Academic Department
  if (!student.department || student.department.trim().length === 0) {
    errors.department = 'Academic department is required.';
  }

  // Degree program
  if (!student.degree || student.degree.trim().length === 0) {
    errors.degree = 'Degree / Major is required.';
  }

  // Semester
  if (
    student.currentSemester === undefined ||
    student.currentSemester < 1 ||
    student.currentSemester > 12
  ) {
    errors.currentSemester = 'Current semester must be between 1 and 12.';
  }

  // Attendance
  if (
    student.attendanceRate === undefined ||
    student.attendanceRate < 0 ||
    student.attendanceRate > 100
  ) {
    errors.attendanceRate = 'Attendance rate must be between 0% and 100%.';
  }

  // Emergency contact
  if (student.emergencyContact) {
    if (!student.emergencyContact.name || student.emergencyContact.name.trim().length < 2) {
      errors.emergencyName = 'Emergency contact person name is required.';
    }
    const emPhoneDigits = (student.emergencyContact.phone || '').replace(/\D/g, '');
    if (student.emergencyContact.phone && emPhoneDigits.length < 10) {
      errors.emergencyPhone = 'Emergency contact phone must have at least 10 digits.';
    }
  }

  // Courses
  if (!student.courses || student.courses.length === 0) {
    errors.courses = 'At least one enrolled course is required to calculate academic standing.';
  } else {
    const invalidCourse = student.courses.some(
      c => !c.code.trim() || !c.name.trim() || c.credits < 1 || c.credits > 6
    );
    if (invalidCourse) {
      errors.courses = 'All courses must have a code, name, and valid credit hours (1-6).';
    }
  }

  return errors;
}

export const POPULAR_DEPARTMENTS = [
  'Computer Science & Engineering',
  'Data Science & AI',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Business Administration',
  'Biotechnology & Bioinformatics',
  'Civil & Environmental Engineering',
  'Mathematics & Statistics',
];

export const DEGREES = [
  'Bachelor of Science (B.Sc.)',
  'Bachelor of Technology (B.Tech)',
  'Bachelor of Business Administration (BBA)',
  'Master of Science (M.Sc.)',
  'Master of Technology (M.Tech)',
  'Doctor of Philosophy (Ph.D.)',
];
