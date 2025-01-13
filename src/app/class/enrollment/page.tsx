'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define the types
interface Course {
  id: number;
  name: string;
}

interface Student {
  first_name: string;
  last_name: string;
  id: number;
}

const Page = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<{ id: number; name: string }[]>([]);
  const [currentCourse, setCurrentCourse] = useState<string>(""); // Dropdown selection


  const [students, setStudents] = useState<Student[]>([]);

  const [formData, setFormData] = useState({
    student_id: "",
    courses_id: [""], // Initializing with an empty student input
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

    const fetchStudentsAndCourses = async () => {
      setError(null);
      // setDataLoading(true);

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const studentResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/`,
          config
        );
        const courseResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course/`,
          config
        );

        console.log(studentResponse.data.results)
        console.log(courseResponse.data.results)

        setStudents(studentResponse.data.results || []);
        setCourses(courseResponse.data.results || []);
      } catch (err) {
        setError("Failed to load students or courses.");
        console.error("Fetch Error:", err);
      } finally {
        // setDataLoading(false);
      }
    };

    fetchStudentsAndCourses();
  }, [token]);

  
  const handleAddCourse = () => {
    const course = courses.find((s) => s.id === Number(currentCourse));
  
    if (course && !selectedCourses.some((s) => s.id === course.id)) {
      setSelectedCourses([...selectedCourses, course]);
      setCurrentCourse(""); // Reset dropdown
    } else if (!course) {
      console.error("Selected student not found in the list.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.student_id ||
      !formData.courses_id 
     
    ) {
      alert("Please fill in all required fields.");
      return;
    }

  

  

    const selectedCourseIds = selectedCourses.map(course => course.id);

    console.log(selectedCourseIds)
    const postData = {
      courses_id: selectedCourseIds,
      student_id: formData.student_id,
    };


    try {
      console.log(postData)
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/enrollment/`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      
      alert("Update classroom successfully!");
      router.push('/class/all-class')
      
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "An unknown error occurred.";
      const errorData = error.response?.data;
      console.error("Error submitting the form:", errorMessage);
      console.error("Full response data:", errorData);
      alert(`Error: ${errorMessage}. Details: ${JSON.stringify(errorData)}`);
    }
  };
  

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col items-center min-h-screen bg-gray-100">
      <div className="flex gap-4 mt-4 flex-row justify-between  max-w-md">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-[#213458] text-white font-bold py-2 px-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => router.push("/class/enrollment/view")}
          className="flex-1 bg-[#213458] w-[445px] text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
        >
          View Enrollment History
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Student Enrollment</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Select Student */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Select Student
            </label>
            <select
              value={formData.student_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  student_id: e.target.value, // Update user_id in formData
                })
              }

              className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a student</option>
              {students.length > 0 ? (
                students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name}
                  </option>
                ))
              ) : (
                <option disabled>Loading students...</option>
              )}
              
            </select>
          </div>


          <div className="p-4 bg-gray-50 rounded shadow-md ">
      <label className="text-lg font-semibold text-gray-800 mb-2">Select a Course</label>
      <div className="flex items-center mt-4 ">
        <select
          className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currentCourse}
          onChange={(e) => setCurrentCourse(e.target.value)} // Track dropdown selection
        >
          <option value="">Select a Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="ml-2 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          onClick={handleAddCourse} // Add selected student to the table
        >
          Add
        </button>
      </div>

      {/* Display selected students in a table */}
      {selectedCourses.length > 0 && (
        <table className="mt-16 w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 ">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedCourses.map((student) => (
              <tr key={student.id}>
                <td className="border border-gray-300 px-4 py-2">{student.id}</td>
                <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    type="button"
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                    // onClick={() => handleRemoveStudent(student.id)} // Remove student from the table
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`bg-[#213458] text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-[#214598] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Enrolling..." : "Enroll Student"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
