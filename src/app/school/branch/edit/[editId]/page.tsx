'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/components/Button";
import { useRouter, useParams } from "next/navigation";  // Use useParams for dynamic route

interface School {
  id: number;
  name: string;
  address: string;
  email: string | null;
  established_date: string;
  phone_number: string;
  schoolweb: string | null;
}

const Page: React.FC = () => {
  const [branchName, setBranchName] = useState<string>("");
  const [branchAddress, setBranchAddress] = useState<string>("");
  const [branchLocation, setBranchLocation] = useState<string>("");
  const [branchPhoneNumber, setBranchPhoneNumber] = useState<string>("");
  const [branchEmail, setBranchEmail] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);

  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const [token, setToken] = useState<string | null>(null);
  const id = parseInt(params.editId as string, 10);
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Fetch schools and branch data when token and branchId are available
  useEffect(() => {
    console.log("Branch ID:",id); // Log branchId to ensure it's being retrieved correctly
    if (!token || !id) return;

    const fetchSchoolsAndBranch = async () => {
      try {
        // Fetch schools
        const schoolResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schools/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Schools:", schoolResponse.data.results); // Log the fetched schools
        setSchools(schoolResponse.data.results);

        // Fetch branch data
        const branchResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/branches/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Branch data:", branchResponse.data);  // Log this to see if the data is correct

        const branchData = branchResponse.data;
        setBranchName(branchData.name);
        setBranchAddress(branchData.address);
        setBranchLocation(branchData.location);
        setBranchPhoneNumber(branchData.phone_number);
        setBranchEmail(branchData.email);
        setUserId(branchData.user_id);
        setSelectedSchool(branchData.school.id);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
      }
    };

    fetchSchoolsAndBranch();
  }, [token, id]);

  // Handle school change
  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setSelectedSchool(selectedId);
  };

  // Handle form submission for update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare branch data to send
      const branchData = {
        name: branchName,
        address: branchAddress,
        phone_number: branchPhoneNumber,
        email: branchEmail,
        location: branchLocation,
        user_id: userId,
        school_id: selectedSchool || null,
      };

      console.log("Updating data:", branchData);

      // Submit branch data using PUT request
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/branches/${id}/`, branchData, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure the token is included in the request
        },
      });

      // Redirect after successful update
      router.push("/school/branch");
    } catch (err) {
      setError("Failed to update branch. Please check the form and try again.");
      console.error("Submission error:", err);
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  return (
    <div className="lg:ml-[18%] ml-[11%] mt-24 flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="w-[540px] max-w-2xl mx-auto bg-white shadow-lg p-8 rounded-lg"
      >
        <h1 className="text-xl font-bold text-gray-800 mb-8 text-center">
          Update Branch
        </h1>

        {/* Branch Information */}
        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Branch Name
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            placeholder="Enter branch name"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Branch Address
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={branchAddress}
            onChange={(e) => setBranchAddress(e.target.value)}
            placeholder="Enter branch address"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Branch Phone Number
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={branchPhoneNumber}
            onChange={(e) => setBranchPhoneNumber(e.target.value)}
            placeholder="Enter branch phone number"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Branch Email
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            value={branchEmail}
            onChange={(e) => setBranchEmail(e.target.value)}
            placeholder="Enter branch email"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Branch Location
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={branchLocation}
            onChange={(e) => setBranchLocation(e.target.value)}
            placeholder="Enter branch location"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            User ID
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            placeholder="Enter user ID"
            required
          />
        </div>

        {/* School Information */}
        <h2 className="text-2xl font-bold text-gray-700 mt-8 mb-4">
          School Information
        </h2>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Select School
          </label>
          <select
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedSchool || ""}
            onChange={handleSchoolChange}
            required
          >
            <option value="">Select a school</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <Button className="bg-[#213458] flex items-center justify-center hover:bg[#213498] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default Page;
