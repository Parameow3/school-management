"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Branch {
  id: number;
  name: string;
}

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    branch_id: "", // Update the field to branch
  });

  const [branches, setBranches] = useState<Branch[]>([]); // Changed to Branch array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Fetch auth token and redirect if not found
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Fetch branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/branches`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
          },
        });
        setBranches(response.data.results || []);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching branches:", err.response?.data || err.message);
        setError("Failed to load branches");
        setLoading(false);
      }
    };

    if (token) {
      fetchBranches();
    }
  }, [token]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.branch_id) {
      alert("All fields are required.");
      return;
    }
    console.log("Form Data Submitted:", formData);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/`, // Assuming we're creating a program
        
          formData // Ensure the branch ID is a number
        ,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log("Form Data Submitted:", response.data);
      alert("Program created successfully.");
      router.push("/program/all-program"); // Redirect to program list or reset form
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("Failed to create program.");
    }
  };

  if (loading) {
    return <p>Loading branches...</p>;
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

          {/* Branch Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch
            </label>
            <select
              name="branch_id"
              value={formData.branch_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  branch_id: e.target.value, // Update user_id in formData
                })
              }
              className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#213458] focus:border-indigo-500"
              required
            >
              <option value="" disabled>Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={branches.length === 0}
            className={`w-[316px] h-[44px] ${
              branches.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#213458] hover:bg-[#213498] text-white'
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
