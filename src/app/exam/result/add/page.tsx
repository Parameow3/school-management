'use client'; // Next.js directive for client-side code
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';




interface ExamResult {
  id: number;
  student_name: string;
  student_id: string;
  exam_id:string;
  title: string;
  score: string;
  exam_name: string;
  grade: string;
  exam_date: string;
}

const Page = () => {
  const [students, setStudents] = useState<any[]>([]); // To store students for dropdown
  const [exams, setExams] = useState<any[]>([]); // To store exams for dropdown
  const [selectedStudent, setSelectedStudent] = useState(''); // Selected student ID
  const [selectedExam, setSelectedExam] = useState(''); // Selected exam ID
  const [score, setScore] = useState('');
  const [grade, setGrade] = useState('');
  const [exam_date, setExam_date] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [loadingStudents, setLoadingStudents] = useState(true); // Separate loading state for students
  const [loadingExams, setLoadingExams] = useState(true); // Separate loading state for exams
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Success state after submission
  const router = useRouter();

  // Fetch students and exams when component mounts
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login'); // Redirect to login if no token found
      return;
    }

    // Fetch students
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Attach the token in Authorization header
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched students:', data); // Debugging log to inspect the structure
        if (data.results && data.results.length > 0) {
          setStudents(data.results); // Use `data.results` as the response is paginated
        } else {
          console.log('No students found');
        }
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setError('Error fetching students');
      })
      .finally(() => setLoadingStudents(false)); // Always set loading to false once the request completes

    // Fetch exams
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/exams/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Attach the token in Authorization header
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch exams');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched exams:', data.results); // Debugging log
        if (data.results && data.results.length > 0) {
          setExams(data.results);
        } else {
          console.log('No exams found');
        }
      })
      .catch((error) => {
        console.error('Error fetching exams:', error);
        setError('Error fetching exams');
      })
      .finally(() => setLoadingExams(false)); // Always set loading to false once the request completes
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login'); // Redirect to login if no token found
      return;
    }

    // Data to be submitted in the POST request
    const examResultData = {
      student_id: selectedStudent,
      exam_id: selectedExam,
      exam_date: exam_date,
      score,
      grade,
    };

    try {
      console.log(examResultData)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/exam-results/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Attach the token in Authorization header
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examResultData),
      });

      if (!response.ok) {
        throw new Error('Failed to add exam result');
      }

      setSuccess(true); // Show success message
      setSelectedStudent(''); // Reset the form
      setSelectedExam('');
      setScore('');
      setGrade('');
      
      // Show success alert
      window.alert('Exam result added successfully!');
    } catch (error) {
      setError('Failed to add exam result');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-9 flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Add Exam Result</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">Exam result added successfully!</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={loadingStudents}
            >
              <option value="">Select a student</option>
              {loadingStudents ? (
                <option disabled>Loading students...</option>
              ) : (
                students.length > 0 ? (
                  students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {`${student.first_name} ${student.last_name}`} {/* Display full name */}
                    </option>
                  ))
                ) : (
                  <option disabled>No students found</option>
                )
              )}
            </select>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">Exam</label>
            <select
              name='exam_id'
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={loadingExams}
            >
              <option value="">Select an exam</option>
              {loadingExams ? (
                <option disabled>Loading exams...</option>
              ) : (
                exams.length > 0 ? (
                  exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title}
                      
                    </option>
                  ))
                ) : (
                  <option disabled>No exams found</option>
                )
              )}
            </select>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">Score</label>
            <input
              type="text"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter score"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">Grade</label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="mt-2 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter grade"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Exam Result'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
