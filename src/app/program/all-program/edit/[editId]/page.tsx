'use client';
import Button from "@/components/Button";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation"; // Use 'useParams' and 'useRouter' for navigation

const EditProgramPage = () => {
  const { editId } = useParams(); // Get the dynamic route parameter (program ID)
  const router = useRouter(); // For navigation

  const [formData, setFormData] = useState({
    name: "", // This matches "name" in the backend
    description: "", // This matches "description" in the backend
    school: 1, // Default value of 1, assuming the school is always 1
  });

  const [loading, setLoading] = useState(true); // Loading state for fetching program data

  // **Explicitly type the error as `string | null`**
  const [error, setError] = useState<string | null>(null); // Allow both string and null

  // Fetch the program data for editing when the page loads (and the ID is available)
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/academics/program/${editId}/`);
        setFormData({
          name: response.data.name,
          description: response.data.description,
          school: response.data.school, // Assuming school is also returned by the API
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching programs or course data:", err);
        setError("Failed to load data"); // Now, this can be a string without error
        setLoading(false); // Stop loading if error occurs
      }
    };

    if (editId) {
      fetchProgram();
    }
  }, [editId]); // Re-run the effect if the ID changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/academics/program/${editId}/`, formData);
      console.log("Program Updated:", response.data);
      alert("Program Updated Successfully");
      router.push("/programs"); // Redirect to the programs list or wherever needed
    } catch (error) {
      console.error("Error updating the program:", error);
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

          {/* School Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School
            </label>
            <select
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="1">School 1</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-[316px] h-[44px] bg-[#213458] hover:bg-[#213498] text-white font-bold rounded-lg shadow-md transition-colors"
          >
            Update Program
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProgramPage;
