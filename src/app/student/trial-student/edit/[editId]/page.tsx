"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import ProgramDropdown from "@/components/programDropdown";
import { useRouter, useParams} from "next/navigation";

const EditPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.editId as string, 10); 
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [teachers, setTeachers] = useState<{ id: number; username: string }[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<number | "">("");
  const [selectedPrograms, setSelectedPrograms] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    client: "",
    phone: "",
    number_student: "",
    programs: [] as number[],
    status: "Pending",
    assign_by: 1,
    handle_by: [] as number[],
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
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();
          const adminUsers = data.results.filter((user: any) => user.roles === 1);
          const teacherUsers = data.results.filter((user: any) => user.roles_name === "teacher");

          setUsers(adminUsers);
          setTeachers(teacherUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      const fetchTrailData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/${id}/`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();
          setFormData({
            client: data.client,
            phone: data.phone,
            number_student: data.number_student,
            programs: data.programs,
            status: data.status,
            assign_by: data.assign_by,
            handle_by: data.handle_by,
          });
          setSelectedTeacher(data.handle_by[0] || "");
          setSelectedPrograms(data.programs || []);
        } catch (error) {
          console.error("Error fetching trail data:", error);
        }
      };

      fetchUsers();
      fetchTrailData();
    }
  }, [token, id]);

  const handleTeacherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const teacherId = parseInt(event.target.value);
    setSelectedTeacher(teacherId);
    setFormData((prev) => ({
      ...prev,
      handle_by: [teacherId],
    }));
  };

  const handleProgramSelect = (selectedPrograms: number[]) => {
    setSelectedPrograms(selectedPrograms);
    setFormData((prevData) => ({
      ...prevData,
      programs: selectedPrograms,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "number_student" || name === "assign_by" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      alert("Authorization token is missing. Please log in.");
      return;
    }

    const dataToSubmit = {
      client: formData.client,
      phone: formData.phone,
      number_student: formData.number_student,
      programs: formData.programs,
      status: formData.status.toUpperCase(),
      assign_by: formData.assign_by,
      handle_by: formData.handle_by,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (response.ok) {
        alert("Trial information updated successfully!");
        router.push("/student/trial-student/view");
      } else {
        const errorData = await response.json();
        alert(`Failed to update trial information: ${errorData.detail || errorData.message}`);
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
          Edit-student
        </span>
        <Link href="/#" passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src="/refresh.svg" width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>

      <div className="flex flex-row justify-between p-3">
        <h1 className="text-center text-2xl font-bold mb-8 mt-4 border-b-2">
          Edit Trial Form
        </h1>
        <Button className="w-[180px] p-2" onClick={() => router.push(`/student/trial-student/view`)}>
          View
        </Button>
      </div>

      {/* Form */}
      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
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

        <div>
          <label htmlFor="programs" className="block text-sm font-medium text-gray-700">
            Select Programs:
          </label>
          <ProgramDropdown 
            onSelect={handleProgramSelect}
            selectedPrograms={selectedPrograms}
          />
        </div>

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
            required
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label htmlFor="assign_by" className="block text-sm font-medium text-gray-700">
            Assigned By
          </label>
          <select
            id="assign_by"
            name="assign_by"
            value={formData.assign_by}
            onChange={handleChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
            required
          >
            <option value="">Select an admin</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="handle_by" className="block text-sm font-medium text-gray-700">
            Handle By
          </label>
          <select
            id="handle_by"
            name="handle_by"
            value={selectedTeacher || ""}
            onChange={handleTeacherChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
            required
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.username}
              </option>
            ))}
          </select>
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

export default EditPage;
