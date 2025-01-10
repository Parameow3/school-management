"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
const Register: React.FC = () => {
  const router = useRouter();
  const [roles, setRoles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    specialization : "",
    roles: "", 
  });
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }

    if (token) {
        axios
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/roles`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setRoles(response.data);
    
            // Automatically find and set the "Teacher" role
            const teacherRole = response.data.find(
                (role: any) => role.name.toLowerCase() === "teacher"
              );
                          console.log(teacherRole)
            if (teacherRole) {
              setFormData((prev) => ({ ...prev, roles: teacherRole.id.toString() }));
            } else {
              setError("Teacher role not found.");
            }
          })
          .catch((err) => {
            setError("Failed to load roles. Please try again.");
          });
      }
  }, [router, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData)
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`,
        {
          ...formData,
          roles: formData.roles,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Registration successful!");
      router.push("/teacher/all-teacher"); // Redirect to program list or reset form
      console.log(response.data); // Log the response to see the submitted data
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };
 
  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
     
    <div className="flex flex-col items-center justify-center mt-2">
      <div className="bg-white shadow-2xl rounded-xl p-8 sm:p-10 max-w-md w-full">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <p className="text-gray-700 mt-4 text-center text-lg font-semibold">
          Create Teacher
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full h-12 p-3 border border-gray-300 rounded-md shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full h-12 p-3 border border-gray-300 rounded-md shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full h-12 p-3 border border-gray-300 rounded-md shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
                htmlFor="specialization"
                className="block text-sm font-medium text-gray-700"
            >
                Specialization
            </label>
            <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="mt-1 block w-full h-12 p-3 border border-gray-300 rounded-md shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>


          

          <button
            type="submit"
            className="w-full py-3  bg-[#213458] text-white rounded-md shadow-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Register;
