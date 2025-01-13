"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

interface Student {
  id: number;
  first_name: string;
}

interface Course {
  id: number;
  name: string;
}

interface Enrollment{
  id: number;
  student_name: string;
  enrollment_date: string;
  course_names: string[];
  student_id : number;
  courses_id : number[];


}

const Page = () => {

  const [isMounted, setIsMounted] = useState(false);


  const [students, setStudents] = useState<Student[]>([]);

  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<string>(""); // Dropdown selection


  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<{ id: number; name: string }[]>([]);

  const [formData, setFormData] = useState<Enrollment[]>([]);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const enrollmentId = parseInt(params.editId as string, 10);


  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const fetchData = async () => {
        try {
          console.log("Enrollment ID:", enrollmentId);

          const [studentResponse, coursesResponse, enrollmentDetailResponse] = await Promise.all([
            axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                  },
                }
            ),
            axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course/`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                  },
                }
            ),
            axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/enrollment/${enrollmentId}/`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                  },
                }
            ),
          ]);

          console.log("Students Fetched:", studentResponse?.data?.results);
          console.log("Courses Fetched:", coursesResponse?.data?.results);
          console.log("Enrollment Fetched:", enrollmentDetailResponse?.data);

          setStudents(studentResponse?.data?.results || []);
          setCourses(coursesResponse?.data?.results || []);
          setFormData([enrollmentDetailResponse?.data]);
        } catch (error: any) {
          console.error("Error loading students or courses", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isMounted, enrollmentId]); // Add `enrollmentId` as a dependency


  const handleAddCourse = () => {
      const selectedId = Number(currentCourse);
      console.log("Selected ID:", selectedId);
    
      // Find the student based on the selected ID
      const selectedCourseToAdd = courses.find(
        (course) => course.id === selectedId
      );
    
      // Check if the student exists and is not already added
      if (selectedCourseToAdd && !selectedCourses.some((s) => s.id === selectedId)) {
        // Add student to the selected students array
        setSelectedCourses((prevSelectedStudents) => [
          ...prevSelectedStudents,
          selectedCourseToAdd,
        ]);
    
        // Update the form data
        setFormData((prevFormData) => {
          if (prevFormData.length === 0) {
            // Create a new classroom if none exists
            return [
              {
                id: 1, // Replace with actual classroom ID or logic
                courses_id: [], // Replace with actual course IDs
                course_names: [], // Replace with actual course names
                student_id: 1,
                student_name: "", // Assuming student has a `name` field
                enrollment_date: "",
              },
            ];
          } else {
            // Update existing classroom
            const updatedClassroom = { ...prevFormData[0] }; // Assuming single classroom
    
            if (!updatedClassroom.courses_id.includes(selectedId)) {
              updatedClassroom.courses_id.push(selectedId);
              updatedClassroom.course_names.push(selectedCourseToAdd.name); // Assuming student has a `name` field
            }
    
            return [updatedClassroom];
          }
        });
    
        // Clear the current student selection
        setCurrentCourse("");
      } else {
        alert("Student already added or invalid selection.");
      }
    };

    const handleRemoveCourse = (id: number) => {
      setSelectedCourses(selectedCourses.filter((s) => s.id !== id));
    
      setFormData((prevFormData) => {
        if (prevFormData.length === 0) return prevFormData;
    
        const updatedClassroom = { ...prevFormData[0] }; // Assuming single classroom
        const indexToRemove = updatedClassroom.courses_id.indexOf(id);
        if (indexToRemove !== -1) {
          updatedClassroom.courses_id.splice(indexToRemove, 1);
          updatedClassroom.course_names.splice(indexToRemove, 1);
        }
        return [updatedClassroom];
      });
    };

    const handleInputChange = (id: number, field: any, value: any) => {
      setFormData((prevFormData) =>
        prevFormData.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    };
    
  
    
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault(); // Prevent default form submission behavior
    
      // Validate that formData has valid entries
      if (formData.length === 0) {
        alert("Please add at least one student before submitting.");
        return;
      }
    
      // Map formData to the structure required by your API or backend
      const payload = formData.map((entry) => ({
        student_id: entry.student_id, // Adjust field names as required
        courses_id: entry.courses_id, // Include relevant fields
       
      }));
    
      // merged object
      const result = payload.reduce((acc, entry) => {
        Object.assign(acc, entry); // Merge fields directly into a single object
        return acc;
      }, {} as Record<string, any>);
      // console.log("Submitting data:", result);
  
      try {
        console.log("Submitting data:", result);
        console.log(enrollmentId)
  
        await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/enrollment/${enrollmentId}/`,
          result,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        console.log("Program Updated:", result);
        alert("Program Updated Successfully");
        router.push("/class/enrollment/view"); // Redirect to the programs list or wherever needed
      } catch (err: any) {
        console.error("Error updating the program:", err.response?.data || err.message);
        alert("Failed to update program");
      }
  
    
      // Simulate API submission and handle success/error
      
    };

  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Update Enrollment</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Select Student */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Select Student
            </label>

            {formData.map((data, index) => (
                <select
                    key={data.id || index} // Unique key for each select element
                    value={data.student_id || ""} // Ensure valid default value
                    onChange={(e) => handleInputChange(data.id, 'student_id', Number(e.target.value))}
                    className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                  {/* Default placeholder option */}
                  <option value="" disabled>
                    Select a student
                  </option>

                  {/* Students dropdown */}
                  {students.length > 0 ? (
                      students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {`${student.first_name} ${student.last_name}`} {/* Full name of the student */}
                          </option>
                      ))
                  ) : (
                      <option disabled>Loading students...</option>
                  )}
                </select>
            ))}

          </div>
          

          <div>
        <label 
          htmlFor="student-select" 
          className="block text-lg font-medium text-gray-900 mb-2"
        >
          Select a Course to Add
        </label>
        <div className="flex items-center gap-3">
          <select
            id="student-select"
            className="flex-1 h-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={currentCourse}
            onChange={(e) => setCurrentCourse(e.target.value)}
            aria-label="Select a student"
          >
            <option value="" disabled>
              Select a Student
            </option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} 
              </option>
            ))}
          </select>
          <button
            type="button"
            className="h-10 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            onClick={handleAddCourse}
            disabled={!currentCourse}
            aria-label="Add selected student"
          >
            Add
          </button>
        </div>
      </div>
  
      {/* Display selected students dynamically in a table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Selected Students</h2>
        <table className="w-full text-left border-collapse border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b border-gray-300 font-medium">Student Name</th>
              <th className="px-4 py-2 border-b border-gray-300 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
          {formData.map((classroom) => (
            classroom.courses_id.map((id, index) => (
              <tr 
                key={id} 
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 border-b border-gray-300">{classroom.course_names[index]}</td>
                <td className="px-4 py-2 border-b border-gray-300 text-center">
                  <button
                    type="button"
                    className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                    onClick={() => handleRemoveCourse(id)}
                    aria-label={`Remove student ${classroom.course_names[index]}`}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ))}
          </tbody>
        </table>
      </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`bg-[#213458] text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-[#214598] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Enrollment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
