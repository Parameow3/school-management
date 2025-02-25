"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Button from "@/components/Button";

interface Admin {
  id: number;
  username: string;
}

interface Teacher {
  id: number;
  username: string;
}

interface Program {
  id: number;
  name: string;
}

const UpdateTrialStudent = () => {
  const params = useParams();
  const router = useRouter();
  const trialId = parseInt(params.editId as string, 10);
  const [token, setToken] = useState<string | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    client: "",
    phone: "",
    number_student: "",
    assign_by: "", // Stores the selected admin ID
    handle_by: "",
    status: "Pending",
    reason: "",
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
      const fetchData = async () => {
        try {
          console.log("Fetching admins, teachers, and programs...");

          const [adminRes, teacherRes, programRes] = await Promise.all([
            axios.get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user?role_name=admin`,
              { headers: { Authorization: `Bearer ${token}` } }
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user?role_name=teacher`,
              { headers: { Authorization: `Bearer ${token}` } }
            ),
            axios.get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program`,
              { headers: { Authorization: `Bearer ${token}` } }
            ),
          ]);

          console.log("Admins fetched:", adminRes.data.results);
          console.log("Teachers fetched:", teacherRes.data.results);
          console.log("Programs fetched:", programRes.data.results);

          setAdmins(adminRes.data.results);
          setTeachers(teacherRes.data.results);
          setPrograms(programRes.data.results);

          // ✅ Fetch trial student data and set form values
          if (trialId) {
            console.log(`Fetching trial student data for ID: ${trialId}`);

            const trialResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/${trialId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Trial student data:", trialResponse.data);

            const trialData = trialResponse.data;

            // ✅ Ensure old data loads by checking if values exist
            setFormData((prev) => ({
              ...prev, // Preserve existing state
              client: trialData.client || prev.client || "",
              phone: trialData.phone || prev.phone || "",
              number_student:
                trialData.number_student || prev.number_student || "",
              assign_by: trialData.admin_id?.toString() || prev.assign_by || "", // Ensure it's a string
              handle_by:
                trialData.teacher_id?.map((id: string) => id.toString()) ||
                prev.handle_by ||
                [],
              status: trialData.status || prev.status || "Pending",
              reason: trialData.reason || prev.reason || "",
            }));
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Error loading data.");
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [token, trialId]);

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

    const updatedData = {
      client: formData.client,
      phone: formData.phone,
      number_student: formData.number_student,
      program_id: [],
      status: formData.status.toUpperCase(),
      admin_id: formData.assign_by ? Number(formData.assign_by) : null,
      teacher_id: formData.handle_by ? Number(formData.handle_by) : null,
      reason: formData.reason,
    };
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/${trialId}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("reposne", response);
      if (response.status === 200) {
        alert("Trial student updated successfully!");
        router.push("/student/trial-student/view");
      } else {
        alert("Failed to update trial student.");
      }
    } catch (error) {
      console.error("Error updating the trial student:", error);
      alert("Error updating the trial student.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="lg:ml-[219px] mt-20 ml-[25px] flex flex-col">
      <h1 className="text-center text-2xl font-bold mb-8 mt-4">
        Edit Trial Form
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="relative w-full">
          <label
            htmlFor=""
            className="absolute left-4 top 1/2 transform -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-blue-500"
          >
            Client Name
          </label>
          <input
            type="text"
            className="peer w-full px-4 py-2 text-sm text-gray-700 bg-white border rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-transparent "
            name="client"
            value={formData.client}
            onChange={handleChange}
            placeholder="Client Name"
            required
          />
        </div>
        <div className="relative w-full">
          <label
            htmlFor=" 
        "
            className="absolute left-4 top 1/2 transform -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-blue-500"
          >
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="peer w-full px-4 py-2 text-sm text-gray-700 bg-white border rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-transparent "
            required
          />
        </div>
        <div className="relative w-full">
          <label
            htmlFor=""
            className="absolute left-4 top 1/2 transform -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-blue-500"
          >
            Number_Student
          </label>
          <input
            type="number"
            name="number_student"
            value={formData.number_student}
            onChange={handleChange}
            placeholder="Number of Students"
            className="peer w-full px-4 py-2 text-sm text-gray-700 bg-white border rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-transparent "
            required
          />
        </div>
        <div className="relative w-full">
          <label
            htmlFor=""
            className="absolute left-4 top 1/2 transform -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-blue-500"
          >
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="peer w-full px-4 py-2 text-sm text-gray-700 bg-white border rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-transparent "
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>  
        <div className="relative w-full">
        <label
            htmlFor=""
            className="absolute left-4 top 1/2 transform -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-blue-500"
          >
            Handle_By
          </label>
        <select
          name="handle_by"
          value={formData.handle_by}
          onChange={handleChange}
          className="peer w-full px-4 py-2 text-sm text-gray-700 bg-white border rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-transparent "
        >
          <option value="">Select a teacher</option>
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.username}
              </option>
            ))
          ) : (
            <option value="">No teachers available</option>
          )}
        </select>
</div>
<div>
<label
            htmlFor=""
            className="absolute left-4 top 1/2 transform -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-blue-500"
          >
           Assign_By
          </label>
        <select
          name="assign_by"
          value={formData.assign_by}
          onChange={handleChange}
          className="peer w-full px-4 py-2 text-sm text-gray-700 bg-white border rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-transparent "
        >
          <option value="">Select an admin</option>
          {admins.length > 0 ? (
            admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.username}
              </option>
            ))
          ) : (
            <option value="">No admins available</option>
          )}
        </select>
</div>
        <div className="ml-[420px] w-[187px]">
        <button
          type="submit"
          className="bg-[#213458] text-white px-4 py-2 rounded text-center flex items-center justify-center"
        >
          Update Trial Student
        </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTrialStudent;
