export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: LetterGrade;
  semester?: number;
}

export type AcademicStanding = 
  | "President's Honors"
  | "Dean's List"
  | "First Class Standing"
  | "Good Standing"
  | "Academic Warning"
  | "Academic Probation";

export interface Student {
  id: string;
  studentId: string; // e.g. "STU-2024-101"
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  avatarUrl?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  // Academic details
  department: string;
  degree: string;
  enrollmentYear: number;
  currentSemester: number;
  courses: Course[];
  cgpa: number;
  totalCreditsEarned: number;
  attendanceRate: number; // percentage, e.g. 88
  standing: AcademicStanding;
  bio?: string;
  skills?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  searchQuery: string;
  department: string;
  semester: string;
  standing: string;
  minCgpa: number;
  sortBy: 'name-asc' | 'name-desc' | 'cgpa-desc' | 'cgpa-asc' | 'studentId-asc' | 'attendance-desc';
}

export type ActiveView = 'directory' | 'profile' | 'form' | 'calculator';
