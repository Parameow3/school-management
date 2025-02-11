"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Register: React.FC = () => {
  const router = useRouter();
  const [roles, setRoles] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]); // State for groups
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    roleId: "",
    groupId: "", // New field for group selection
  });
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Fetch roles and groups
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }

    if (tokenFromLocalStorage) {
      const fetchRolesAndGroups = async () => {
        try {
          // Fetch roles
          const rolesResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/roles`,
            {
              headers: {
                Authorization: `Bearer ${tokenFromLocalStorage}`,
              },
            }
          );
          setRoles(rolesResponse.data);

          // Fetch groups
          const groupsResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/group`,
            {
              headers: {
                Authorization: `Bearer ${tokenFromLocalStorage}`,
              },
            }
          );
          setGroups(groupsResponse.data);
        } catch (err: any) {
          const errorMessage = err.response?.data?.detail || err.message;
          console.error("Error fetching roles/groups:", errorMessage);
          setError("Failed to load roles or groups. Please try again.");
        }
      };

      fetchRolesAndGroups();
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`,
        {
          ...formData,
          roles: formData.roleId,
          groups: [parseInt(formData.groupId)], // Include selected group
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Registration successful!");
      console.log(response.data); // Log the response to see the submitted data
      router.push("/setting/register/view");
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message;
      console.error("Error registering user:", errorMessage);
      setError("Registration failed. Please try again.");
    }
  };

  const handleViewAllUsers = () => {
    router.push("/setting/register/view");
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
      <div className="flex ml-[556px]">
        <button
          onClick={handleViewAllUsers}
          className="bg-[#213458] text-[15px] text-white py-2 px-5 rounded-lg shadow-lg hover:bg-[#213498] transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          View All Users
        </button>
      </div>
      <div className="flex flex-col items-center justify-center mt-2">
        <div className="bg-white shadow-2xl rounded-xl p-8 sm:p-10 max-w-md w-full">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <p className="text-gray-700 mt-4 text-center text-lg font-semibold">
            Create User
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
                htmlFor="roleId"
                className="block text-sm font-medium text-gray-700"
              >
                Select Role
              </label>
              <select
                id="roleId"
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                required
                className="mt-1 block w-full h-12 p-3 border border-gray-300 rounded-md shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} - {role.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="groupId"
                className="block text-sm font-medium text-gray-700"
              >
                Select Group
              </label>
              <select
                id="groupId"
                name="groupId"
                value={formData.groupId}
                onChange={handleChange}
                required
                className="mt-1 block w-full h-12 p-3 border border-gray-300 rounded-md shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#213458] text-white rounded-md shadow-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
