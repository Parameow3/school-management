"use client"; // Next.js directive for client-side code
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import Image from "next/image";



interface ExamResult {
  id: number;
  student_name: string;
  title: string;
  score: string;
  exam_name: string;
  grade: string;
  exam_date: string;
}


const Page = () => {

  const [results, setResults] = useState<ExamResult[]>([]);

  const [token, setToken] = useState<string | null>(null);
  const [exams, setExams] = useState<any[]>([]); // Store all exams
  const [examResults, setExamResults] = useState<ExamResult[]>([]); // Store all exam results
  const [loading, setLoading] = useState(true); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [selectedExamResultId, setSelectedExamResultId] = useState<
    number | null
  >(null); // For tracking selected exam result for deletion
  const router = useRouter();

  // Retrieve token from local storage or redirect to login if not found
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage); // Set token state
    } else {
      router.push("/login"); // Redirect to login
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      setLoading(true); // Set loading to true while fetching data

      // Fetch exam data
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/exams`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token in Authorization header
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch exams");
          }
          return response.json();
        })
        .then((examData) => {
          console.log(examData)
          setExams(examData || []); // Store all exams
        })
        .catch((error) => {
          console.error("Error fetching exams:", error); // Log any errors
        });

      // Fetch exam results data
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/exam-results`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token in Authorization header
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch exam results");
          }
          return response.json();
        })
        .then((examResultsData) => {

          console.log(examResultsData.results)
          setExamResults(examResultsData.results || []); // Store all exam results
          setLoading(false); // Set loading to false after fetching data
        })
        .catch((error) => {
          console.error("Error fetching exam results:", error); // Log any errors
          setLoading(false); // Ensure loading is set to false on error
        });
    }
  }, [token]);


  // Function to handle "Edit" action
  const handleEdit = (resultId: number) => {
    router.push(`/exam/result/edit/${resultId}`); // Redirect to the edit page
  };

  // Function to handle "Delete" action
  const handleDelete = (resultId: number) => {
    setSelectedExamResultId(resultId); // Store the selected result ID for deletion
    setIsModalOpen(true); // Open the modal
  };

  // Function to confirm deletion
  const confirmDelete = () => {
    const idToDelete = selectedExamResultId;
    if (!idToDelete) return;

    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/exam-results/${idToDelete}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token in Authorization header
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete exam result");
        }
        setExamResults((prevResults) =>
          prevResults.filter((result) => result.id !== idToDelete)
        );
        setIsModalOpen(false); // Close the modal after deletion
      })
      .catch((error) => {
        console.error("Error deleting exam result:", error); // Log any errors
      });
  };

  // Close modal handler
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20">
      {isModalOpen && (
        <Modal
          onClose={closeModal}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete ?"
        />
      )}
      <section className="flex justify-around p-2">
        <h1 className="text-3xl font-bold mb-6 col-span-full items-center justify-center flex">
          Exam Results
        </h1>
        <button
          className="bg-[#213458] rounded-md text-white text-sm font-semibold py-2 px-4 shadow-md hover:bg-[#1a2844] transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => router.push(`/exam/result/add`)}
        >
          Add Exam Result
        </button>
      </section>
      <div className="overflow-x-auto mt-2">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-4 bg-gray-100 font-bold text-left">
                Student Name
              </th>
              <th className="py-3 px-4 bg-gray-100 font-bold text-left">
                Score
              </th>
              <th className="py-3 px-4 bg-gray-100 font-bold text-left">
                Grade
              </th>
              <th className="py-3 px-4 bg-gray-100 font-bold text-left">
                Exam Name
              </th>
              <th className="py-3 px-4 bg-gray-100 font-bold text-left">
                Exam Date
              </th>
              <th className="py-3 px-4 bg-gray-100 font-bold text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
        
              {examResults.map((result) => (
                <tr key={result.id} className="border-b">
                  <td className="py-2 px-4">{result.student_name}</td>
                  <td className="py-2 px-4">{result.score}</td>
                  <td className="py-2 px-4">{result.grade}</td>
                  <td className="py-2 px-4">{result.exam_name}</td>
                  <td className="py-2 px-4">{result.exam_date}</td>
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-4"
                      onClick={() => handleEdit(result.id)}
                      disabled={!result.id}
                    >
                      <Image
                        src="/edit.svg"
                        alt="Edit"
                        width={25}
                        height={25}
                        className="w-[25px] h-[25px]"
                      />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(result.id)}
                      disabled={!result.id}
                    >
                      <Image
                        src="/delete.svg"
                        alt="Delete"
                        width={25}
                        height={25}
                        className="w-[25px] h-[25px]"
                      />
                    </button>
                  </td>
                </tr>
              ))}
           
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
