'use client'; // Next.js directive for client-side code
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [token, setToken] = useState<string | null>(null);
  const [exams, setExams] = useState<any[]>([]); // Multiple exams as an array
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
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/exams/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Attach the token in Authorization header
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setExams(data.results); // Set exams from the 'results' array
        })
        .catch((error) => {
          console.error('Error fetching exams:', error);
        });
    }
  }, [token]);

  // Handler for button click (example function)
  const handleButtonClick = () => {
    // Action to be performed when the button is clicked
    router.push(`/exam/add`);
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20">
      <h1 className="text-2xl font-bold mb-6 col-span-full">Exam Details</h1>
      
      {/* Button added here */}
      <div className="mb-4">
        <button
          onClick={handleButtonClick} // Add your button action here
          className="bg-[#213458] text-white px-4 py-2 rounded-md hover:bg-[#213498] transition-colors duration-300"
        >
          Add New Exam
        </button>
      </div>

      <div className="flex flex-row md:grid-cols-2 gap-4">
        {exams.length > 0 ? (
          exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white border border-gray-200 rounded-lg mt-4 shadow-md p-6 w-[320px] transform transition-transform hover:scale-105 duration-300"
            >
              <div className="flex justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold text-gray-800">{exam.title}</h2>
                <p className="text-lg font-semibold text-gray-800">{exam.exam_date}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p className="text-lg font-semibold text-gray-700">{exam.start_time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Time</p>
                  <p className="text-lg font-semibold text-gray-700">{exam.end_time}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 mt-4 w-full">No exam details available</p>
        )}
      </div>
    </div>
  );
};

export default Page;
