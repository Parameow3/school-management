"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
interface Course {
  id: number;
  name: string;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string
}

interface Teacher {
  username: string;
  id: number;
}

interface Classroom {
  id: number;
  name: string;
  courses_id: number[];
  course_names: string[];
  teacher_name: string;
  teacher_id : number;
  student_id: number[];
  student_names: string[];
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
}


const Page: React.FC = () => {

  
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();
  const router = useRouter();
  const classroomId = parseInt(params.editId as string, 10);
  console.log(classroomId)
  
  

  const [formData, setFormData] = useState<Classroom[]>([]);

  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<string>(""); // Dropdown selection
  const [selectedCourses, setSelectedCourses] = useState<{ id: number; name: string }[]>([]);


  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<string>(""); // Dropdown selection
  const [selectedStudents, setSelectedStudents] = useState<{ id: number; first_name: string }[]>([]);

  const [ selectClassrooms , setSelectClarooms ] =  useState<Classroom [] > ([]);
  const [classroom, setClassroom] = useState<Classroom[]>([]); // Default students
  
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [errorCourses, setErrorCourses] = useState<string | null>(null);
  const [errorTeachers, setErrorTeachers] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setIsMounted(true);
  }, []);


  useEffect(() => {
    if (isMounted) {
      const fetchData = async () => {
        try {
          const [studentResponse, coursesResponse, classroomDetailResponse, teacherResponse] = await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course/`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom/${classroomId}/`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user?role_name=teacher`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
          ]);

          setStudents(studentResponse?.data?.results || []);
          setCourses(coursesResponse?.data?.results || []);
          setFormData([classroomDetailResponse?.data]);
          setTeachers(teacherResponse?.data?.results || []);
        } catch (error) {
          console.error("Error loading data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isMounted, classroomId]);

  
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
              name: "", // Replace with actual data
              courses_id: [], // Replace with actual course IDs
              course_names: [], // Replace with actual course names
              teacher_id: 1,
              teacher_name: "", // Replace with actual teacher name
              student_id: [selectedId],
              student_names: [selectedCourseToAdd.name], // Assuming student has a `name` field
              start_date: "", // Replace with actual start date
              end_date: "", // Replace with actual end date
              start_time: "", // Replace with actual start time
              end_time: "", // Replace with actual end time
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

  // Handle removing a student
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
              id: new Date().getTime(), // Use a unique identifier, like a timestamp
              name: "",
              courses_id: [],
              course_names: [],
              teacher_id: 1,
              teacher_name: "",
              student_id: [selectedId],
              student_names: [
                selectedStudentToAdd.first_name + " " + selectedStudentToAdd.last_name,
              ],
              start_date: "",
              end_date: "",
              start_time: "",
              end_time: "",
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



  const handleRemoveStudent = (id: number) => {
    // Remove student from selectedStudents
    setSelectedStudents(selectedStudents.filter((s) => s.id !== id));

    // Update formData
    setFormData((prevFormData) => {
      if (prevFormData.length === 0) return prevFormData;

      const updatedClassroom = { ...prevFormData[0] }; // Assuming single classroom
      const indexToRemove = updatedClassroom.student_id.indexOf(id);

      if (indexToRemove !== -1) {
        updatedClassroom.student_id.splice(indexToRemove, 1); // Remove student ID
        updatedClassroom.student_names.splice(indexToRemove, 1); // Remove student name
      }

      console.log("Updated FormData:", updatedClassroom); // Debugging log

      return [updatedClassroom]; // Return updated classroom
    });
  };


  const handleInputChange = (id: number, field: any, value: any) => {
    setFormData((prevFormData) =>
      prevFormData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    id: number // Identifier to locate the specific object in the array
  ) => {
    const { name, value } = e.target;
  
    setFormData((prevFormData) =>
      prevFormData.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
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
      name : entry.name,
      student_id: entry.student_id, // Adjust field names as required
      courses_id: entry.courses_id, // Include relevant fields
      start_date: entry.start_date,
      end_date: entry.end_date,
      start_time: entry.start_time,
      end_time: entry.end_time,
      teacher_id:entry.teacher_id,
    }));
  
    // merged object
    const result = payload.reduce((acc, entry) => {
      Object.assign(acc, entry); // Merge fields directly into a single object
      return acc;
    }, {} as Record<string, any>);
    // console.log("Submitting data:", result);

    try {
      console.log("Submitting data:", result);
      console.log(classroomId)

      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom/${classroomId}/`,
        result,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log("Program Updated:", result);
      alert("Program Updated Successfully");
      router.push("/class/all-class"); // Redirect to the programs list or wherever needed
    } catch (err: any) {
      console.error("Error updating the program:", err.response?.data || err.message);
      alert("Failed to update program");
    }

  
    // Simulate API submission and handle success/error
    
  };

  
  
  


  

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (

    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
      <div className="lg:w-[60%] w-[90%] mx-auto mt-10 p-6 bg-white rounded-lg shadow-md space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Update Class Form</h1>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label
              htmlFor="className"
              className="text-sm font-medium text-gray-700"
            >
              Class Name
            </label>

            {formData.map((data, index) => (
                <input
                    key={data.id || index} // Add a unique key, preferably using `data.id`
                    id="className"
                    name="className"
                    type="text"
                    placeholder="Enter Class Name"
                    className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleInputChange(data.id, 'name', e.target.value)}
                    value={data.name}
                />
            ))}
          </div>



          <div className="flex flex-col">
            <label
              htmlFor="teacher"
              className="text-sm font-medium text-gray-700"
            >
              Teacher
            </label>

            {formData.map((data, index) => (
                <select
                    key={data.id || index} // Add a unique key for the select element
                    id="teacher"
                    name="teacher"
                    className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={data.teacher_id}
                    onChange={(e) => handleInputChange(data.id, 'teacher_id', Number(e.target.value))}
                >
                  {/* Remove the inner formData.map(). It seems redundant */}
                  <option value="" disabled>
                    Select a teacher
                  </option>

                  {/* Use the teachers array for teacher options */}
                  {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.username}
                      </option>
                  ))}
                </select>
            ))}


          </div>


          <div className="flex flex-col">
            <label
              htmlFor="start_date"
              className="text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            {formData.map((data, index) => (
                <input
                    key={data.id || index} // Add a unique key for each input element
                    id="start_date"
                    name="start_date"
                    type="date"
                    className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={data.start_date || ""} // Ensure value is a valid string, defaulting to an empty string
                    onChange={(e) => handleChange(e, data.id)} // Pass the event and the data ID to the handler
                />
            ))}


          </div>

          <div className="flex flex-col">
            <label
              htmlFor="end_date"
              className="text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            {formData.map((data, index) => (
                <input
                    key={data.id || index} // Add a unique key for each input element
                    id="end_date"
                    name="end_date"
                    type="date"
                    className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={data.end_date || ""} // Ensure value is a valid string, defaulting to an empty string
                    onChange={(e) => handleChange(e, data.id)} // Pass the event and the data ID to the handler
                />
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
              Select a course
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Selected course</h2>
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
                {student.first_name + " " + student.last_name} 
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
              <th className="px-4 py-2 border-b border-gray-300 font-medium">Student Name</th>
              <th className="px-4 py-2 border-b border-gray-300 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
          {formData.map((classroom, classroomIndex) => (
              classroom.student_id.map((id, index) => (
                  <tr
                      key={`${classroom.id}-${id}`} // Use unique keys for rows
                      className="hover:bg-gray-50 transition-colors"
                  >
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

     
        </div>
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-[184px] px-4 py-2 bg-[#213458] text-white rounded flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-[#214567]"
            onClick={handleSubmit}

          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;