'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation"; // Use 'useParams' and 'useRouter' for navigation

interface School {
  id: number;
  name: string;
}

const Page = () => {
  const { editId } = useParams(); // Get the dynamic route parameter (program ID)
  const router = useRouter(); // For navigation

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    school: "", // Initialize school as an empty string to handle no selection
  });
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      // Redirect to login if no token
      router.push("/login");
    }
  }, [router]);

  // Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/schools', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Pass token if available
          },
        });
        console.log("Fetched Schools:", response.data.results);
        setSchools(response.data.results || []);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching schools:", err.response?.data || err.message);
        setError("Failed to load schools");
        setLoading(false);
      }
    };

    if (token) {
      fetchSchools();
    }
  }, [token]);

  // Fetch the program data for editing
  useEffect(() => {
    if (!editId || !token) return;

    const fetchProgram = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/academics/program/${editId}/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request headers
          },
        });
        setFormData({
          name: response.data.name,
          description: response.data.description,
          school: response.data.school, // Assuming the school is returned by the API
        });
      } catch (err: any) {
        console.error("Error fetching program data:", err.response?.data || err.message);
        setError("Failed to load program data");
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [editId, token]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Authorization token is missing.");
      router.push("/login");
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/academics/program/${editId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request headers
          },
        }
      );
      console.log("Program Updated:", response.data);
      alert("Program Updated Successfully");
      router.push("/programs"); // Redirect to the programs list or wherever needed
    } catch (err: any) {
      console.error("Error updating the program:", err.response?.data || err.message);
      alert("Failed to update program");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>; // Display the error message if it exists
  }

  return (
    <div className="flex justify-center items-center lg:mt-8 min-h-screen bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg lg:ml-[16%] ml-[5%] shadow-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-[#213458] mb-6">
          Edit Program
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Program Name Field */}
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

          {/* Program Description Field */}
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
              <option value="" disabled>Select a school</option>
              {schools.length > 0 ? (
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
            className="w-[316px] h-[44px] bg-[#213458] hover:bg-[#213478] text-white font-bold rounded-lg shadow-md transition-colors"
          >
            Update Program
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
