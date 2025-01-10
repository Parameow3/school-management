'use client'; // Next.js directive for client-side code
import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const Page = () => {
  const [students, setStudents] = useState<any[]>([]); // To store students for dropdown
  const [exams, setExams] = useState<any[]>([]); // To store exams for dropdown
  const [selectedStudent, setSelectedStudent] = useState(''); // Selected student ID
  const [selectedExam, setSelectedExam] = useState(''); // Selected exam ID
  const [score, setScore] = useState(''); // Score field
  const [grade, setGrade] = useState(''); // Grade field
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const [loadingStudents, setLoadingStudents] = useState(true); // Separate loading state for students
  const [loadingExams, setLoadingExams] = useState(true); // Separate loading state for exams
  const [error, setError] = useState(''); // Error state
  const [success, setSuccess] = useState(false); // Success state after form submission
  const router = useRouter();
  const searchParams = useSearchParams(); // Get the search params to extract the examResultId
  const params = useParams();
  const id = parseInt(params.editId as string, 10);
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
        Authorization: `Bearer ${token}`, // Attach the token in Authorization header
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
        console.log('Fetched students:', data.results); // Log student data
        if (data.results && data.results.length > 0) {
          setStudents(data.results); // Store students in state
        } else {
          console.log('No students found');
        }
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setError('Error fetching students');
      })
      .finally(() => setLoadingStudents(false)); // Stop loading after students are fetched

    // Fetch exams
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/exams/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in Authorization header
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
        console.log('Fetched exams:', data); // Log exam data
        if (data && data.length > 0) {
          setExams(data); // Store exams in state
        } else {
          console.log('No exams found');
        }
      })
      .catch((error) => {
        console.error('Error fetching exams:', error);
        setError('Error fetching exams');
      })
      .finally(() => setLoadingExams(false)); // Stop loading after exams are fetched

    // Fetch the existing exam result if `examResultId` is present
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/exam-results/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token in Authorization header
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch exam result');
          }
          return response.json();
        })
        .then((examResult) => {
          // Log the fetched exam result data for debugging
          console.log('Fetched exam result:', examResult);

          // Populate the form fields with the existing data
          setSelectedStudent(examResult.student); // Pre-select the student
          setSelectedExam(examResult.exam); // Pre-select the exam
          setScore(examResult.score); // Pre-fill the score
          setGrade(examResult.grade); // Pre-fill the grade
        })
        .catch((error) => {
          console.error('Error fetching exam result:', error);
          setError('Failed to load the exam result for editing.');
        });
    }
  }, [router, id]);

  // Handle form submission (PUT request)
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

    // Data to be submitted in the PUT request for updating
    const examResultData = {
      student: selectedStudent,
      exam: selectedExam,
      score,
      grade,
    };

    // Send PUT request to update the exam result
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/exam-results/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token in Authorization header
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examResultData), // Send updated data
      });

      if (!response.ok) {
        throw new Error('Failed to update exam result');
      }

      setSuccess(true); // Show success message
      window.alert('Exam result updated successfully!');
    } catch (error) {
      setError('Failed to update exam result');
      console.error('Error updating form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-9 flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Update Exam Result</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">Exam result updated successfully!</p>}

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
            className="w-full bg-[#213458] text-white py-3 px-6 rounded-lg shadow-md hover:bg-[#214598] transition-all duration-300 hover:shadow-lg"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Exam Result'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
