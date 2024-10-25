'use client'; // Next.js directive for client-side code
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Helper function to format time if needed
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':'); // Split the time into hours and minutes
  return `${hours}:${minutes}`; // Return the formatted time without seconds
};

const Page = () => {
  const [token, setToken] = useState<string | null>(null);
  const [exams, setExams] = useState<any[]>([]); // Ensure 'exams' is always an array
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();

  // Retrieve token from local storage or redirect to login if not found
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem('authToken');
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage); // Set token state
    } else {
      router.push('/login'); // Redirect to login
    }
  }, [router]);

  // Fetch exam data if token is present
  useEffect(() => {
    if (token) {
      console.log('Fetching exam data...');
      setLoading(true); // Set loading to true while fetching data
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/exams/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Attach the token in Authorization header
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Data received:', data); // Log the received data
          setExams(data || []); // Use the array directly from data
          setLoading(false); // Set loading to false after fetching data
        })
        .catch((error) => {
          console.error('Error fetching exams:', error); // Log any errors
          setLoading(false); // Ensure loading is set to false on error
        });
    }
  }, [token]);

  // Handler for button click to add new exam
  const handleButtonClick = () => {
    router.push(`/exam/exam/add`);
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20">
      <h1 className="text-3xl font-bold mb-6 col-span-full items-center justify-center flex">Exam Details</h1>
      
      {/* Button to add a new exam */}
      <div className="mb-4">
        <button
          onClick={handleButtonClick}
          className="bg-[#213458] text-white px-6 py-3 rounded-lg hover:bg-[#1b2d4e] shadow-lg transition-transform transform hover:scale-105 duration-300"
        >
          Add New Exam
        </button>
      </div>

      {/* Conditional rendering for loading state */}
      {loading ? (
        <p className="text-lg text-gray-600">Loading exam details...</p> // Show a loading message while fetching data
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams && exams.length > 0 ? (
            exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-4 gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">{exam.title}</h2>
                  <p className="text-lg text-gray-500">{exam.exam_date}</p>
                </div>
                <p className="text-lg text-[#213458] text-center font-semibold mb-4">{exam.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Start Time</p>
                    <p className="text-lg font-semibold text-gray-800">{formatTime(exam.start_time)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">End Time</p>
                    <p className="text-lg font-semibold text-gray-800">{formatTime(exam.end_time)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-600 mt-4 w-full text-center">No exam details available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
