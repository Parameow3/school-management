"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Register: React.FC = () => {
  const router = useRouter();
  const [roles, setRoles] = useState<{ id: number; name: string; description: string }[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    roleId: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch roles from the API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/roles`);
        
        // Assuming the response is in the correct format
        if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          setError("Unexpected response format for roles.");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setError("Failed to fetch roles.");
      }
    };

    fetchRoles();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("Registration successful:", response.data);
      alert("Registration successful!");
      router.push("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-300">
      <div className="bg-white shadow-2xl rounded-lg p-10 max-w-lg w-full">
        {/* Logo and Welcome Message */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/AAA logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
          <p className="text-gray-700 mt-4 text-center text-lg font-semibold">
            Let's get you signed up!
          </p>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Role Selection */}
        <div className="flex justify-center space-x-4 mb-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setFormData({ ...formData, roleId: role.id.toString() })}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-200">
                <Image src={`/icons/${role.name}.png`} alt={role.name} width={24} height={24} />
              </div>
              <span className="mt-2 text-sm text-gray-700">{role.name}</span>
            </div>
          ))}
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full h-12 p-3 border border-gray-300 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full h-12 p-3 border border-gray-300 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full h-12 p-3 border border-gray-300 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
