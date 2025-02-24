
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import ProgramDropdown from "@/components/programDropdown";
import { useRouter } from "next/navigation";
import axios from "axios";
import { EyeIcon } from "@heroicons/react/24/solid";


interface Program {
  id: number;
  name: string;
}




const Page = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [admins, setAdmins] = useState<{ id: number; username: string }[]>([]);

  const [teachers, setTeachers] = useState<{ id: number; username: string }[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<{ id: number; username: string }[]>([]);
  const [currentTeacher, setCurrentTeacher] = useState<string>(""); // Dropdown selection

  const [programs, setProgams] = useState<{ id: number; name: string }[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<{ id: number; name: string }[]>([]);
  const [currentProgram, setCurrentProgram] = useState<string>(""); // Dropdown selection


  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [errorTeachers, setErrorTeachers] = useState<string | null>(null);



  const [formData, setFormData] = useState({
    client: "",
    phone: "",
    number_student: "",
    assign_by: "",
    // program_id: [] as number[],
    program_name: [""],
    status: "Pending",
    admin_name : "",
    teacher_name: [""] ,
    // teacher_id: 1,
    // admin_id: [] ,
    reason: ""
  });

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      const fetchUsers = async () => {
        try {
          const [teacherResponse, adminResponse , programResponse] = await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user?role_name=teacher`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user?role_name=admin`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

         
          console.log(teacherResponse)
          console.log(adminResponse)
          console.log(programResponse)

          setProgams(programResponse.data.results)
          setAdmins(adminResponse.data.results);
          setTeachers(teacherResponse.data.results);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }
  }, [token]);

  // const handleTeacherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const teacherId = parseInt(event.target.value);
  //   setSelectedTeacher(teacherId);
  //   setFormData((prev) => ({
  //     ...prev,
  //     handle_by: [teacherId],
  //   }));
  // };

  const handleAddProgram = () => {
    const program = programs.find((s) => s.id === Number(currentProgram));
  
    if (program && !selectedPrograms.some((s) => s.id === program.id)) {
      setSelectedPrograms([...selectedPrograms, program]);
      setCurrentProgram(""); // Reset dropdown
    } else if (!program) {
      console.error("Selected student not found in the list.");
    }
    console.log(program)
  };

  const handleRemoveProgram = (id: number) => {
    setSelectedPrograms(selectedPrograms .filter((s) => s.id !== id));
  };



  const handleAddTeacher = () => {
    const teacher = teachers.find((s) => s.id === Number(currentTeacher));
  
    if (teacher && !selectedTeacher.some((s) => s.id === teacher.id)) {
      setSelectedTeacher([...selectedTeacher, teacher]);
      setCurrentTeacher(""); // Reset dropdown
    } else if (!teacher) {
      console.error("Selected student not found in the list.");
    }
  };


  // const handleProgramSelect = (selectedPrograms: number[]) => {
  //   setSelectedPrograms(selectedPrograms);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     programs: selectedPrograms,
  //   }));
  // };

  const handleRemoveTeacher = (id: number) => {
    setSelectedTeacher(selectedTeacher.filter((s) => s.id !== id));
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    if (!token) {
      alert("Authorization token is missing. Please log in.");
      return;
    }
    console.log(formData.assign_by)

    const selectedTeacherId = selectedTeacher.map(teacher => teacher.id);
    const selectedProgramId = selectedPrograms.map(program => program.id);
    console.log(selectedProgramId)
    console.log(selectedTeacherId)

    const dataToSubmit = {
      client: formData.client,
      phone: formData.phone,
      number_student: formData.number_student,
      program_id: selectedProgramId,
      status: formData.status.toUpperCase(),
      admin_id: formData.assign_by,
      teacher_id: selectedTeacherId,
      reason : formData.reason,
    };

    try {
      console.log(dataToSubmit)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (response.ok) {
        alert("Trial information submitted successfully!");
        router.push("/student/trial-student/view"); // Redirect to the programs list or wherever needed

      } else {
        const errorData = await response.json();
        alert(`Failed to submit trial information: ${errorData.detail || errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("Error submitting the form.");
    }
  };

  return (
    <div className="lg:ml-[219px] mt-20 ml-[25px] flex flex-col">
      {/* Header Section */}
      <div className="lg:w-[1060px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[15px]">
          Student |{" "}
          <Image src="/home.svg" width={15} height={15} alt="public" />{" "}
          Trail-student
        </span>
        <Link href="/#" passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src="/refresh.svg" width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>

      <div className="flex flex-row justify-between p-3">
        <h1 className="text-center text-2xl font-bold mb-8 mt-4 border-b-2">
          Trial Form
        </h1>
        <button
                    onClick={() => router.push(`/student/trial-student/view`)}
                    className="hover:scale-110 transition-transform transform w-[98px] justify-center items-center h-[34px] flex flex-row gap-2 text-gray-300 bg-[#213458] hover:bg-gray-300"
                  >
                    <EyeIcon className="w-5 h-5 text-gray-300" /> View
                  </button>
      </div>

      {/* Form */}
      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        {/* Client (Student Name) */}
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">
            Client (Student Name)
          </label>
          <input
            type="text"
            id="client"
            name="client"
            value={formData.client}
            onChange={handleChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
            required
          />
        </div>

        {/* Number of Students */}
        <div>
          <label htmlFor="number_student" className="block text-sm font-medium text-gray-700">
            Number Of Students
          </label>
          <input
            type="number"
            id="number_student"
            name="number_student"
            value={formData.number_student}
            onChange={handleChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
            required
          />
        </div>

       

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
            // required
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            Reason
          </label>
          <input
            type="text"
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
          />
        </div>


        {/* Assigned By */}
        <div>
          <label htmlFor="assign_by" className="block text-sm font-medium text-gray-700">
            Assigned By
          </label>
          
          <select
            id="assign_by"
            name="assign_by"
            onChange={handleChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
            required
          >
            <option value="">Select an admin</option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.username}
              </option>
            ))}
          </select>
        </div>

         {/* Programs */}
         <div className="p-4 bg-gray-50 rounded shadow-md ">
      <label className="text-lg font-semibold text-gray-800 mb-2">Select a Program</label>
      <div className="flex items-center mt-4 ">
        <select
          className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currentProgram}
          onChange={(e) => setCurrentProgram(e.target.value)} // Track dropdown selection
        >
          <option value="">Select a Program</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="ml-2 text-white bg-[#213458] hover:bg-[#213498] px-3 py-1 rounded"
          onClick={handleAddProgram} // Add selected student to the table
        >
          Add
        </button>
      </div>

      {/* Display selected students in a table */}
      {selectedPrograms.length > 0 && (
        <table className="mt-16 w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 ">
              
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedPrograms.map((program) => (
              <tr key={program.id}>
               
                <td className="border border-gray-300 px-4 py-2">{program.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    type="button"
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                    onClick={() => handleRemoveProgram(program.id)} // Remove student from the table
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



        {/* Handled By */}
        <div className="p-4 bg-gray-50 rounded shadow-md ">
      <label className="text-lg font-semibold text-gray-800 mb-2">Select a Teacher</label>
      <div className="flex items-center mt-4 ">
        <select
          className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currentTeacher}
          onChange={(e) => setCurrentTeacher(e.target.value)} // Track dropdown selection
        >
          <option value="">Select a Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.username}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="ml-2 text-white bg-[#213458] hover:bg-[#213498] px-3 py-1 rounded"
          onClick={handleAddTeacher} // Add selected student to the table
        >
          Add
        </button>
      </div>

      {/* Display selected students in a table */}
      {selectedTeacher.length > 0 && (
        <table className="mt-16 w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 ">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedTeacher.map((teacher) => (
              <tr key={teacher.id}>
                <td className="border border-gray-300 px-4 py-2">{teacher.username}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    type="button"
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                    onClick={() => handleRemoveTeacher(teacher.id)} // Remove student from the table
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

        <div className="lg:col-span-3 flex justify-center items-center space-x-4">
          <Button className="lg:h-[40px] h-[40px] flex justify-center items-center px-6 py-2 bg-[#213458] text-white font-medium rounded hover:bg-blue-500">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
