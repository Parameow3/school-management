"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios"; // Import axios to make HTTP requests
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
interface School {
  id: number;
  name: string;
}
const Page = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [schools, setSchools] = useState<School[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  // State for loading
  const [formData, setFormData] = useState({
    user: {
      username: "",
      email: "",
      password: "",
    },
    school: 1, // Assuming this is a valid school ID, adjust as needed
    specialization: "",
    hire_date: new Date().toISOString().slice(0, 16), // Correct date format for datetime-local
  });

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      // Redirect to login if no token
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schools`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Pass token if available
          },
        });
        console.log("Fetched Schools:", response.data.results); // Access 'results' from the response
        setSchools(response.data.results || []); // Set schools to 'results' field
        setLoading(false);
      } catch (err:any) {
        console.error("Error fetching schools:", err.response?.data || err.message);
        setError("Failed to load schools");
        setLoading(false);
      }
    };
  
    if (token) {
      fetchSchools(); // Fetch schools if token is available
    }
  }, [token]);

  // Handle input change for both user and non-user fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "username" || name === "email" || name === "password") {
      setFormData({
        ...formData,
        user: { ...formData.user, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit form to backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      alert("Authorization token is missing. Please log in.");
      router.push("/login");
      return;
    }

    try {
      const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/teacher`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token in Authorization header
          },
        }
      );

      console.log("Response:", response.data);
      router.push('/teacher/all-teacher');
      alert("Teacher information submitted successfully!");
    } catch (error: any) {
      console.error("Error submitting the form:", error);
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.detail || "An error occurred."}`);
      } else {
        alert("Failed to submit the form.");
      }
    }
  };

  return (
    <div className="lg:ml-[18%] ml-[11%] mt-20 flex flex-col">
      <div className="lg:w-[840px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[15px]">
          Teacher | <Image src="/home.svg" width={15} height={15} alt="public" /> New-Teacher
        </span>

        <Link href="/#" passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src="/refresh.svg" width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>

      <h1 className="text-center text-2xl font-bold mb-8 mt-4 border-b-2">Teacher Form</h1>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Teacher Information */}
        <section>
          <h2 className="text-2xl font-bold mb-8 lg:mt-4 border-b-2">Teacher Information</h2>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.user.username}
                onChange={handleChange}
                maxLength={150}
                required
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.user.email}
                onChange={handleChange}
                maxLength={254}
                required
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.user.password}
                onChange={handleChange}
                minLength={6}
                required
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                Specialization:
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                maxLength={255}
                required
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="hire_date" className="block text-sm font-medium text-gray-700">
                Hire Date:
              </label>
              <input
                type="datetime-local"
                id="hire_date"
                name="hire_date"
                value={formData.hire_date} // Correct date format
                onChange={handleChange}
                required
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School
            </label>
            <select
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#213458] focus:border-indigo-500"
              required
            >
              <option value="" disabled selected>Select a school</option>
              {Array.isArray(schools) && schools.length > 0 ? (
                schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No schools available</option>
              )}
            </select>
          </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex justify-center items-center space-x-4">
          <Button bg="secondary">Cancel</Button>
          <Button>Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
