"use client";
import axios from "axios";
import { useEffect, useState } from "react";

// Define interfaces for type safety
interface Course {
  id: number;
  name: string;
}

interface Student {
  id: number;
  first_name: string;
  last_name : string;
}

interface Classroom {
  id: number;
  name: string;
  courses_id: number[];
  course_names: string[];
  teacher_name: string;
  student_id: number[];
  student_names: string[];
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
}


function StudentSelection() {
  const studentId = 1 
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  // const [studentDetail, setStudentDetail] = useState<Student[]>([]);
  
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([
    // { id: 1, first_name: "John Doe" },
    // { id: 2, first_name: "Steeve" },
  ]); // Default students

  const [formData, setFormData] = useState<Classroom[]>([
    
  ]); // Default students

  const [currentStudent, setCurrentStudent] = useState<string>("");

  useEffect(() => {
    console.log('selectSallstudemt:', courses);
    console.log('selectcourse:', students);
    console.log('selectStudent:', formData);
  }, [courses, students, formData]); // Add courses and students to the dependency array

  // Fetch initial students and courses data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentResponse, coursesResponse , classroomDetailResponse] = await Promise.all([
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
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom/${studentId}/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          ),
        ]);
        

        console.log("Students Fetched:", studentResponse?.data?.results);
        console.log("Courses Fetched:", coursesResponse?.data?.results);
        console.log("Courses Fetched:", classroomDetailResponse?.data);

        setStudents(studentResponse?.data?.results || []);
        setCourses(coursesResponse?.data?.results || []);
        setFormData([classroomDetailResponse?.data]);
        
      } catch (error: any) {
        console.error("Error loading students or courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  

  if (loading) {
    return <div>Loading...</div>;
  }

  
    
  // Handle adding a student
  const handleAddStudent = () => {
  const selectedId = Number(currentStudent);
  console.log("Selected ID:", selectedId);

  // Find the student based on the selected ID
  const selectedStudentToAdd = students.find(
    (student) => student.id === selectedId
  );

  // Check if the student exists and is not already added
  if (selectedStudentToAdd && !selectedStudents.some((s) => s.id === selectedId)) {
    // Add student to the selected students array
    setSelectedStudents((prevSelectedStudents) => [
      ...prevSelectedStudents,
      selectedStudentToAdd,
    ]);

    // Update the form data
    setFormData((prevFormData) => {
      if (prevFormData.length === 0) {
        // Create a new classroom if none exists
        return [
          {
            id: 1, // Replace with actual classroom ID or logic
            name: "Default Classroom", // Replace with actual data
            courses_id: [], // Replace with actual course IDs
            course_names: [], // Replace with actual course names
            teacher_name: "Default Teacher", // Replace with actual teacher name
            student_id: [selectedId],
            student_names: [selectedStudentToAdd.first_name], // Assuming student has a `name` field
            start_date: "", // Replace with actual start date
            end_date: "", // Replace with actual end date
            start_time: "", // Replace with actual start time
            end_time: "", // Replace with actual end time
          },
        ];
      } else {
        // Update existing classroom
        const updatedClassroom = { ...prevFormData[0] }; // Assuming single classroom

        if (!updatedClassroom.student_id.includes(selectedId)) {
          updatedClassroom.student_id.push(selectedId);
          updatedClassroom.student_names.push(selectedStudentToAdd.first_name +" "+ selectedStudentToAdd.last_name); // Assuming student has a `name` field
        }

        return [updatedClassroom];
      }
    });

    // Clear the current student selection
    setCurrentStudent("");
  } else {
    alert("Student already added or invalid selection.");
  }
};

  

  // Handle removing a student
  const handleRemoveStudent = (id: number) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== id));
  
    setFormData((prevFormData) => {
      if (prevFormData.length === 0) return prevFormData;
  
      const updatedClassroom = { ...prevFormData[0] }; // Assuming single classroom
      const indexToRemove = updatedClassroom.student_id.indexOf(id);
      if (indexToRemove !== -1) {
        updatedClassroom.student_id.splice(indexToRemove, 1);
        updatedClassroom.student_names.splice(indexToRemove, 1);
      }
      return [updatedClassroom];
    });
  };
  

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    // Validate that formData has valid entries
    if (formData.length === 0) {
      alert("Please add at least one student before submitting.");
      return;
    }
  
    // Map formData to the structure required by your API or backend
    const payload = formData.map((entry) => ({
      id: entry.id,
      student_ids: entry.student_id, // Adjust field names as required
      student_names: entry.student_names,
      courses_id: entry.courses_id, // Include relevant fields
      course_names: entry.course_names,
      start_date: entry.start_date,
      end_date: entry.end_date,
      start_time: entry.start_time,
      end_time: entry.end_time,
      teacher_name: entry.teacher_name,
    }));
  
    // Mock API call or actual submission
    console.log("Submitting data:", payload);
  
    // Simulate API submission and handle success/error
    fakeApiCall(payload)
      .then((response) => {
        alert("Submission successful!");
        console.log("API Response:", response);
        // Optionally clear form or reset state
        setFormData([]);
        setSelectedStudents([]);
      })
      .catch((error) => {
        alert("Submission failed. Please try again.");
        console.error("API Error:", error);
      });
  };
  
  // Mock API call function (replace with actual API call logic)
  const fakeApiCall = (data: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success response
        resolve({ status: "success", data });
      }, 1000);
    });
  };
  
  

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col gap-6 mt-12 ml-20">
      {/* Dropdown to select and add students */}
      
      <div>
        <label 
          htmlFor="student-select" 
          className="block text-lg font-medium text-gray-900 mb-2"
        >
          Select a Student to Add
        </label>
        <div className="flex items-center gap-3">
          <select
            id="student-select"
            className="flex-1 h-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={currentStudent}
            onChange={(e) => setCurrentStudent(e.target.value)}
            aria-label="Select a student"
          >
            <option value="" disabled>
              Select a Student
            </option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.first_name} {student.last_name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="h-10 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            onClick={handleAddStudent}
            disabled={!currentStudent}
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
              <th className="px-4 py-2 border-b border-gray-300 font-medium">Student ID</th>
              <th className="px-4 py-2 border-b border-gray-300 font-medium">Name</th>
              <th className="px-4 py-2 border-b border-gray-300 font-medium">Student Name</th>
              <th className="px-4 py-2 border-b border-gray-300 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
          {formData.map((classroom) => (
            classroom.student_id.map((id, index) => (
              <tr 
                key={id} 
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 border-b border-gray-300">{id}</td>
                <td className="px-4 py-2 border-b border-gray-300">{classroom.name}</td>
                <td className="px-4 py-2 border-b border-gray-300">{classroom.student_names[index]}</td>
                <td className="px-4 py-2 border-b border-gray-300 text-center">
                  <button
                    type="button"
                    className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                    onClick={() => handleRemoveStudent(id)}
                    aria-label={`Remove student ${classroom.student_names[index]}`}
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
      <div className="flex justify-end">
        <button
          type="button"
          className="mt-4 px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
          onClick={handleSubmit}
          aria-label="Submit selected students"
        >
          Submit
        </button>
      </div>
    </div>
  );
}  

export default StudentSelection;
