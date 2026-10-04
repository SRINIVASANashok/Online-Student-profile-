import { useState, useEffect } from 'react';
import { ActiveView, Student } from './types';
import { INITIAL_STUDENTS } from './data/mockStudents';
import { Navbar } from './components/Navbar';
import { StudentDirectory } from './components/StudentDirectory';
import { StudentProfileView } from './components/StudentProfileView';
import { StudentForm } from './components/StudentForm';
import { GpaCalculatorView } from './components/GpaCalculatorView';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastContainer, ToastMessage } from './components/Toast';

const STORAGE_KEY = 'online_student_profiles_v2';

export default function App() {
  // Students state loaded from LocalStorage or mock data
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('online_student_profiles_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Migrate any outdated image paths to neat static assets
          return parsed.map((s) => {
            const defaultMatch = INITIAL_STUDENTS.find((init) => init.id === s.id);
            if (defaultMatch && (!s.avatarUrl || s.avatarUrl.includes('/src/assets') || s.avatarUrl.includes('images.unsplash.com'))) {
              return { ...s, avatarUrl: defaultMatch.avatarUrl };
            }
            return s;
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse cached student profiles', e);
    }
    return INITIAL_STUDENTS;
  });

  // Active view management
  const [activeView, setActiveView] = useState<ActiveView>('directory');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save student profiles to localStorage', e);
    }
  }, [students]);

  // Actions
  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setActiveView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditProfile = (student: Student) => {
    setEditingStudent(student);
    setActiveView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNew = () => {
    setEditingStudent(null);
    setActiveView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveStudent = (savedStudent: Student) => {
    const exists = students.some((s) => s.id === savedStudent.id);

    if (exists) {
      setStudents((prev) =>
        prev.map((s) => (s.id === savedStudent.id ? savedStudent : s))
      );
      addToast(
        'success',
        'Profile Updated',
        `Academic and personal profile for ${savedStudent.fullName} updated successfully.`
      );
    } else {
      setStudents((prev) => [savedStudent, ...prev]);
      addToast(
        'success',
        'Student Registered',
        `Profile for ${savedStudent.fullName} (${savedStudent.studentId}) created.`
      );
    }

    setSelectedStudent(savedStudent);
    setActiveView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePrompt = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!studentToDelete) return;
    const name = studentToDelete.fullName;
    setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
    if (selectedStudent?.id === studentToDelete.id) {
      setSelectedStudent(null);
      setActiveView('directory');
    }
    addToast('info', 'Profile Deleted', `Student record for ${name} was permanently removed.`);
    setStudentToDelete(null);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all student records back to the default sample dataset?')) {
      setStudents(INITIAL_STUDENTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      addToast('info', 'Demo Data Restored', 'Student records have been restored to initial sample data.');
      setActiveView('directory');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900">
      {/* Top Application Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          if (view === 'form') {
            setEditingStudent(null);
          }
        }}
        studentCount={students.length}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeView === 'directory' && (
          <StudentDirectory
            students={students}
            onSelectStudent={handleViewProfile}
            onEditStudent={handleEditProfile}
            onDeleteStudent={handleDeletePrompt}
            onAddNew={handleAddNew}
          />
        )}

        {activeView === 'profile' && selectedStudent && (
          <StudentProfileView
            student={selectedStudent}
            onBack={() => setActiveView('directory')}
            onEdit={handleEditProfile}
          />
        )}

        {activeView === 'form' && (
          <StudentForm
            initialStudent={editingStudent}
            existingStudents={students}
            onSave={handleSaveStudent}
            onCancel={() => {
              if (selectedStudent && editingStudent) {
                setActiveView('profile');
              } else {
                setActiveView('directory');
              }
            }}
          />
        )}

        {activeView === 'calculator' && (
          <GpaCalculatorView />
        )}
      </main>

      {/* Confirmation Modal */}
      <DeleteConfirmModal
        student={studentToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Feedback Messages */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Minimal Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <span>Office of Academic Records & Registration · Student Information System</span>
          <span>Certified Academic Registry · Standard 4.0 Grade Point Scale</span>
        </div>
      </footer>
    </div>
  );
}
