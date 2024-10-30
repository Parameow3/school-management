"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Enrollment {
  id: number;
  student_name: string;
  course_names: string[];
  enrollment_date: string;
}

const Page: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const fetchPage = async () => {
      setLoading(true);
      setError(null);

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get("http://127.0.0.1:8000/api/academics/enrollment/", config);
        const enrollmentData = response.data;

        const formattedData = enrollmentData.map((enrollment: any) => ({
          id: enrollment.id,
          student_name: enrollment.student_name || "Unknown Student",
          course_names: enrollment.course_names || [],
          enrollment_date: enrollment.enrollment_date || "N/A",
        }));

        setEnrollments(formattedData);
      } catch (err) {
        console.error("Failed to load enrollment history:", err);
        setError("Failed to load enrollment history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [token]);

  const handleEdit = (enrollmentId: number) => {
    router.push(`/class/enrollment/edit/${enrollmentId}`);
  };

  const handleDelete = async (enrollmentId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this enrollment?");
    if (!confirmDelete) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`http://127.0.0.1:8000/api/academics/enrollment/${enrollmentId}/`, config);
      setEnrollments(enrollments.filter((enrollment) => enrollment.id !== enrollmentId));
      alert("Enrollment deleted successfully!");
    } catch (err) {
      console.error("Failed to delete enrollment:", err);
      setError("Failed to delete enrollment.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl border border-gray-200">
        <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">Enrollment History</h1>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {loading ? (
          <div className="text-gray-500 text-center">Loading enrollment history...</div>
        ) : (
          <table className="w-full border-collapse overflow-hidden rounded-lg">
            <thead>
              <tr className="bg-[#213458] text-white">
                <th className="border px-6 py-3 font-medium text-sm uppercase tracking-wider text-center">Student Name</th>
                <th className="border px-6 py-3 font-medium text-sm uppercase tracking-wider text-center">Courses Enrolled</th>
                <th className="border px-6 py-3 font-medium text-sm uppercase tracking-wider text-center">Enrollment Date</th>
                <th className="border px-6 py-3 font-medium text-sm uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.length > 0 ? (
                enrollments.map((enrollment, index) => (
                  <tr
                    key={enrollment.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition duration-200`}
                  >
                    <td className="border px-6 py-4 text-center text-gray-700">{enrollment.student_name}</td>
                    <td className="border px-6 py-4 text-center text-gray-700">
                      {enrollment.course_names.join(", ")}
                    </td>
                    <td className="border px-6 py-4 text-center text-gray-700">{enrollment.enrollment_date}</td>
                    <td className="border px-6 py-4 text-center">
                      <button
                        onClick={() => handleEdit(enrollment.id)}
                        className="mr-2"
                        title="Edit Enrollment"
                      >
                        <Image
                          src={"/edit.svg"}
                          width={20}
                          height={20}
                          alt="Edit"
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(enrollment.id)}
                        title="Delete Enrollment"
                      >
                        <Image
                          src={"/delete.svg"}
                          width={20}
                          height={20}
                          alt="Delete"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="border px-4 py-4 text-center text-gray-500">
                    No enrollment data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Page;
