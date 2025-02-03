'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import ProgramDropdown from '@/components/programDropdown';
import { useRouter, useSearchParams ,useParams} from 'next/navigation';
import axios from 'axios';

interface Trail {
  id: number,
  client: string , 
  phone: string,
  number_student: 1,
  program_id: number[],
  program_name : string[], 
  status: 'Pending',
  admin_id: number,
  admin_name :string,
  teacher_id : number[],
  teacher_name: string[],
  reason : string,
  
}

interface Teacher {
  id : number,
  username : string
}

interface Program {
  id : number ,
  name : string
}

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);


  const editId = parseInt(params.editId as string, 10);

  const [loading, setLoading] = useState(true); // Initial loading state
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);

  const [formData, setFormData] = useState<Trail[]>([]);

  const [admins, setAdmins] = useState<Teacher[]>([]);


  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentTeacher, setCurrentTeacher] = useState<string>(""); // Dropdown selection
  const [selectedTeacher, setSelectedTeacher] = useState<{ id: number; username: string }[]>([]);



  const [programs, setPrograms] = useState<Program[]>([]);
  const [currentProgram, setCurrentProgram] = useState<string>(""); // Dropdown selection
  const [selectedPrograms, setSelectedPrograms] = useState<{ id: number; name: string }[]>([]);


  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem('authToken');
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage); // Set token in state
    } else {
      router.push('/login'); // Redirect if no token
    }
  }, [router]);

  // Fetch student data by ID

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {

      console.log("trailDetailResponse")
      const fetchData = async () => {
        try {
          const [ programResponse, trailDetailResponse, teacherResponse , adminResponse] = await Promise.all([
            
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/${editId}/`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user?role_name=teacher`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user?role_name=admin`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
          ]);

          
          console.log(trailDetailResponse)
          console.log(teacherResponse)
          console.log(programResponse)

          setPrograms(programResponse?.data?.results || []);
          setFormData([trailDetailResponse?.data]);
          setTeachers(teacherResponse?.data?.results || []);
          setAdmins(adminResponse?.data?.results || []);

        } catch (error) {
          console.error("Error loading data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isMounted, editId]);


  
  

  // Handle form changes
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'handle_by' ? [parseInt(value)] : value,
    }));
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

   
  
  const handleInputChange = (id: number, field: any, value: any) => {
    setFormData((prevFormData) =>
      prevFormData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };


  const handleProgramSelect = (selectedPrograms: number[]) => {
    setFormData((prevData) => ({ ...prevData, programs: selectedPrograms }));
  };

  const handleRemoveProgram = (id: number) => {
    setSelectedPrograms(selectedPrograms.filter((s) => s.id !== id));
  
    setFormData((prevFormData) => {
      if (prevFormData.length === 0) return prevFormData;
  
      const updatedProgram = { ...prevFormData[0] }; // Assuming single Program
      const indexToRemove = updatedProgram.program_id.indexOf(id);
      if (indexToRemove !== -1) {
        updatedProgram.program_id.splice(indexToRemove, 1);
        updatedProgram.program_name.splice(indexToRemove, 1);
      }
      return [updatedProgram];
    });
  };


  const handleRemoveTeacher = (id: number) => {
    setSelectedTeacher(selectedTeacher.filter((s) => s.id !== id));
  
    setFormData((prevFormData) => {
      if (prevFormData.length === 0) return prevFormData;
  
      const updatedTeacher = { ...prevFormData[0] }; // Assuming single Program
      const indexToRemove = updatedTeacher.teacher_id.indexOf(id);
      if (indexToRemove !== -1) {
        updatedTeacher.teacher_id.splice(indexToRemove, 1);
        updatedTeacher.teacher_name.splice(indexToRemove, 1);
      }
      return [updatedTeacher];
    });
  };

  const handleAddProgram = () => {
    const selectedId = Number(currentProgram);
    console.log("Selected ID:", selectedId);
  
    // Find the student based on the selected ID
    const selectedProgramoAdd = programs.find(
      (program) => program.id === selectedId
    );
  
    // Check if the program exists and is not already added
    if (selectedProgramoAdd && !selectedPrograms.some((s) => s.id === selectedId)) {
      // Add student to the selected students array
      setSelectedPrograms((prevSelectedPrograms) => [
        ...prevSelectedPrograms,
        selectedProgramoAdd,
      ]);
  
      // Update the form data
      setFormData((prevFormData) => {
        if (prevFormData.length === 0) {
          // Create a new classroom if none exists
          return [
            {
              id: new Date().getTime(), // Use a unique identifier, like a timestamp
              client: "",
              phone: "",
              status: "Pending", // Add a default value for the status
              teacher_id: [], // Default empty array for teacher IDs
              teacher_name: [], // Default empty array for teacher names
              admin_id: 1, // Assign a default admin ID
              admin_name: "", // Assign a default admin name
              program_id: [selectedId], // Use selectedId for the program ID
              program_name: [selectedProgramoAdd.name], // Use the name from selectedProgramoAdd
              number_student: 1, // Ensure this field is included as expected by the 
              reason: "",
             
            },

           
            
          ];
        } else {
          // Update existing classroom
          const updatedProgram = { ...prevFormData[0] }; // Assuming single classroom
  
          if (!updatedProgram.program_id.includes(selectedId)) {
            updatedProgram.program_id.push(selectedId);
            updatedProgram.program_name.push(selectedProgramoAdd.name ); // Assuming student has a `name` field
          }
  
          return [updatedProgram];
        }
      });
       // Clear the current student selection
       setCurrentProgram("");
      } else {
        alert("Student already added or invalid selection.");
      }
    };


  const handleAddStudent = () => {
    const selectedId = Number(currentTeacher);
    console.log("Selected ID:", selectedId);
  
    // Find the student based on the selected ID
    const selectedTeacherAdd = teachers.find(
      (teacher) => teacher.id === selectedId
    );
  
    // Check if the program exists and is not already added
    if (selectedTeacherAdd && !selectedTeacher.some((s) => s.id === selectedId)) {
      // Add student to the selected students array
      setSelectedTeacher((prevSelectedPrograms) => [
        ...prevSelectedPrograms,
        selectedTeacherAdd,
      ]);
  
      // Update the form data
      setFormData((prevFormData) => {
        if (prevFormData.length === 0) {
          // Create a new classroom if none exists
          return [
            {
              id: new Date().getTime(), // Use a unique identifier, like a timestamp
              client: "",
              phone: "",
              status: "Pending", // Add a default value for the status
              teacher_id: [selectedId], // Default empty array for teacher IDs
              teacher_name: [selectedTeacherAdd.username], // Default empty array for teacher names
              admin_id: 1, // Assign a default admin ID
              admin_name: "", // Assign a default admin name
              program_id: [], // Use selectedId for the program ID
              program_name: [], // Use the name from selectedProgramoAdd
              number_student: 1, // Ensure this field is included as expected by the type
              reason: "",
             
            },

           
            
          ];
        } else {
          // Update existing classroom
          const updatedTeacher = { ...prevFormData[0] }; // Assuming single classroom
  
          if (!updatedTeacher.teacher_id.includes(selectedId)) {
            updatedTeacher.teacher_id.push(selectedId);
            updatedTeacher.teacher_name.push(selectedTeacherAdd.username ); // Assuming student has a `name` field
          }
  
          return [updatedTeacher];
        }
      });
       // Clear the current student selection
       setCurrentProgram("");
      } else {
        alert("Student already added or invalid selection.");
      }
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
      client : entry.client,
      phone : entry.phone,
      number_student: entry.number_student, // Adjust field names as required
      program_id : entry.program_id,
      admin_id: entry.admin_id, // Include relevant fields
      teacher_id: entry.teacher_id,
      status: entry.status,
      reason: entry.reason,
     
    }));

   
  
    // merged object
    const result = payload.reduce((acc, entry) => {
      Object.assign(acc, entry); // Merge fields directly into a single object
      return acc;
    }, {} as Record<string, any>);
    // console.log("Submitting data:", result);

    try {
      console.log("Submitting data:", result);
      console.log(editId)

      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/${editId}/`,
        result,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log("Program Updated:", result);
      alert("Student Trail Updated Successfully");
      router.push("/student/trial-student/view"); // Redirect to the programs list or wherever needed
    } catch (err: any) {
      console.error("Error updating the program:", err.response?.data || err.message);
      alert("Failed to update program");
    }

  
    // Simulate API submission and handle success/error
    
  };

  

  return (
    <div className="lg:ml-[219px] mt-20 ml-[25px] flex flex-col">
      <div className="lg:w-[1060px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[15px]">
          Student | <Image src="/home.svg" width={15} height={15} alt="public" /> Update-student
        </span>
        <Link href="/#" passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src="/refresh.svg" width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>

      <div className="flex flex-row justify-between p-3">
        <h1 className="text-center text-2xl font-bold mb-8 mt-4 border-b-2">Update Trial Form</h1>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
      
      <div className="flex flex-col">
            <label
              htmlFor=""
              className="text-sm font-medium text-gray-700"
            >
              Client name
            </label>
            {formData.map((data, index) => (
                <input
                    key={data.id || index} // Add a unique key for each input element
                    id="client"
                    name="client"
                    type="text"
                    className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={data.client || ""} // Ensure value is a valid string, defaulting to an empty string
                    onChange={(e) => handleChange(e, data.id)} // Pass the event and the data ID to the handler
                />
            ))}


          </div>



          <div className="flex flex-col">
            <label
              htmlFor=""
              className="text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            {formData.map((data, index) => (
                <input
                    key={data.id || index} // Add a unique key for each input element
                    id="phone"
                    name="phone"
                    type="text"
                    className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={data.phone || ""} // Ensure value is a valid string, defaulting to an empty string
                    onChange={(e) => handleChange(e, data.id)} // Pass the event and the data ID to the handler
                />
            ))}


          </div>

          <div className="flex flex-col">
            <label
              htmlFor=""
              className="text-sm font-medium text-gray-700"
            >
              Amount of student
            </label>
            {formData.map((data, index) => (
                <input
                    key={data.id || index} // Add a unique key for each input element
                    id="nu"
                    name="number_student"
                    type="text"
                    className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={data.number_student || ""} // Ensure value is a valid string, defaulting to an empty string
                    onChange={(e) => handleChange(e, data.id)} // Pass the event and the data ID to the handler
                />
            ))}


          </div>

            <div>
              <div>
              <label 
                htmlFor="program-select" 
                className="block text-lg font-medium text-gray-900 mb-2"
              >
                Select a Program to Add
              </label>
              <div className="flex items-center gap-3">
                <select
                  id="program-select"
                  className="flex-1 h-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentProgram}
                  onChange={(e) => setCurrentProgram(e.target.value)}
                  aria-label="Select a Program"
                >
                  <option value="" disabled>
                    Select a Program 
                  </option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name} 
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="h-10 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                  onClick={handleAddProgram}
                  disabled={!currentProgram}
                  aria-label="Add selected student"
                >
                  Add
                </button>
              </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Selected Program</h2>
            <table className="w-full text-left border-collapse border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b border-gray-300 font-medium">Program Name</th>
                  <th className="px-4 py-2 border-b border-gray-300 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody>
              {formData.map((program) => (
                program.program_id.map((id, index) => (
                  <tr 
                    key={id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 border-b border-gray-300">{program.program_name[index]}</td>
                    <td className="px-4 py-2 border-b border-gray-300 text-center">
                      <button
                        type="button"
                        className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                        onClick={() => handleRemoveProgram(id)}
                        aria-label={`Remove student ${program.program_name[index]}`}
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

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          {formData.map((data) => (
              <select
                  key={data.id} // <-- Add this key prop
                  id="status"
                  name="status"
                  value={data.status}
                  onChange={handleStatusChange}
                  className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
              >
                <option value={data.status}>{data.status}</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
          ))}
        </div>


        <div className="flex flex-col">
          <label
              htmlFor=""
              className="text-sm font-medium text-gray-700"
          >
            Reason
          </label>
          {formData.map((data, index) => (
              <input
                  key={data.id || index} // Add a unique key for each input element
                  id="reason"
                  name="reason"
                  type="text"
                  className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={data.reason || ""} // Ensure value is a valid string, defaulting to an empty string
                    onChange={(e) => handleChange(e, data.id)} // Pass the event and the data ID to the handler
                />
            ))}


          </div>


        <div className="flex flex-col">
            <label
              htmlFor="admin"
              className="text-sm font-medium text-gray-700"
            >
              Admin
            </label>

            {formData.map((data, index) => (
                <select
                    key={data.id || index} // Add a unique key for the select element
                    id="admin"
                    name="admin"
                    className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={data.admin_id}
                    onChange={(e) => handleInputChange(data.id, 'admin_id', Number(e.target.value))}
                >
                  {/* Remove the inner formData.map(). It seems redundant */}
                  <option value="" disabled>
                    Select a Admin
                  </option>

                  {/* Use the teachers array for teacher options */}
                  {admins.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.username}
                      </option>
                  ))}
                </select>
            ))}
          </div>

           <div>
              <div>
              <label 
                htmlFor="program-select" 
                className="block text-lg font-medium text-gray-900 mb-2"
              >
                Select a Teacher to Add
              </label>
              <div className="flex items-center gap-3">
                <select
                  id="program-select"
                  className="flex-1 h-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentTeacher}
                  onChange={(e) => setCurrentTeacher(e.target.value)}
                  aria-label="Select a Program"
                >
                  <option value="" disabled>
                    Select a Teacher 
                  </option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.username} 
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="h-10 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                  onClick={handleAddStudent}
                  disabled={!currentTeacher}
                  aria-label="Add selected student"
                >
                  Add
                </button>
              </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Selected Teacher</h2>
            <table className="w-full text-left border-collapse border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b border-gray-300 font-medium">Teacher Name</th>
                  <th className="px-4 py-2 border-b border-gray-300 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody>
              {formData.map((teacher) => (
                teacher.teacher_id.map((id, index) => (
                  <tr 
                    key={id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 border-b border-gray-300">{teacher.teacher_name[index]}</td>
                    <td className="px-4 py-2 border-b border-gray-300 text-center">
                      <button
                        type="button"
                        className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                        onClick={() => handleRemoveTeacher(id)}
                        aria-label={`Remove student ${teacher.teacher_name[index]}`}
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

        <div className="lg:col-span-3 flex justify-center items-center space-x-4">
          <Button className="lg:h-[40px] h-[40px] flex justify-center items-center px-6 py-2 bg-[#213458] text-white font-medium rounded hover:bg-blue-500">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
