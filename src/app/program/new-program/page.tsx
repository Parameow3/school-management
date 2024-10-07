'use client'
import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { useRouter } from "next/navigation";

interface School {
  id: number;
  name: string;
}

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "", 
    description: "", 
    school: "", 
  });
  
  const [schools, setSchools] = useState<School[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [token, setToken] = useState<string | null>(null); 
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
        console.log("Fetched Schools:", response.data.results); 
        setSchools(response.data.results || []);
        setLoading(false);
      } catch (err:any) {
        console.error("Error fetching schools:", err.response?.data || err.message);
        setError("Failed to load schools");
        setLoading(false);
      }
    };
  
    if (token) {
      fetchSchools(); 
    }
  }, [token]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log("Updated Form Data:", { ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
      console.log("Form Data Submitted:", response.data);
      alert("Create Program Successful");
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("Create Program Failed");
    }
  };

  if (loading) {
    return <p>Loading schools...</p>; 
  }

  if (error) {
    return <p>{error}</p>; 
  }

  return (
    <div className="flex justify-center items-center lg:mt-8 min-h-screen bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg lg:ml-[16%] ml-[5%] shadow-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-[#213458] mb-6">
          Create Program
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program's Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter program name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program's Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter program description"
              required
            />
          </div>

          {/* School Dropdown */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={schools.length === 0}
            className={`w-[316px] h-[44px] ${
              schools.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#213458] hover:bg-[#213498] text-white'
            } font-bold rounded-lg shadow-md transition-colors`}
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
