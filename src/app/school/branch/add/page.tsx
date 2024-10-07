"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

interface School {
  id: number;
  name: string;
  address: string;
  email: string | null;
  established_date: string;
  phone_number: string; // Ensure this matches the backend field
  schoolweb: string | null; // Ensure this matches the backend field and handles null
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
  const [schoolName, setSchoolName] = useState<string>("");
  const [schoolAddress, setSchoolAddress] = useState<string>("");
  const [schoolPhoneNumber, setSchoolPhoneNumber] = useState<string>("");
  const [schoolEmail, setSchoolEmail] = useState<string>("");
  const [schoolEstablishedDate, setSchoolEstablishedDate] = useState<string>("");
  const [schoolWebsite, setSchoolWebsite] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Fetch the token on component mount
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Fetch the schools when the token is available
  useEffect(() => {
    if (!token) return;
    const fetchSchools = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schools/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSchools(response.data.results);
      } catch (err) {
        console.error("Error fetching schools:", err);
        setError("Failed to fetch schools.");
      }
    };

    fetchSchools();
  }, [token]);

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setSelectedSchool(selectedId);
    const school = schools.find((school) => school.id === selectedId);
    if (school) {
      setSchoolName(school.name);
      setSchoolAddress(school.address);
      setSchoolEmail(school.email || "");
      setSchoolEstablishedDate(school.established_date);
      setSchoolPhoneNumber(school.phone_number);
      setSchoolWebsite(school.schoolweb || "Website not available"); // Fallback in case of null
    } else {
      // Clear if no school is selected
      setSchoolName("");
      setSchoolAddress("");
      setSchoolEmail("");
      setSchoolEstablishedDate("");
      setSchoolPhoneNumber("");
      setSchoolWebsite("");
    }
  };

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
        school_id: selectedSchool || null, // Use school_id if selected
        // Always send school data, even if school is selected
        school: {
          name: schoolName,
          address: schoolAddress,
          phone_number: schoolPhoneNumber,
          email: schoolEmail,
          established_date: schoolEstablishedDate,
          website: schoolWebsite,
        },
      };
      console.log("Submitting data:", branchData);
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/branches/`, branchData, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure the token is included in the request
        },
      });
      router.push("/branches");
    } catch (err) {
      alert("Failed to add branch. Please check the form and try again."); // Show alert on failure
      setLoading(false);
    }
  };

  return (
    <div className="lg:ml-[18%] ml-[11%] mt-24 flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="w-[540px] max-w-2xl mx-auto bg-white shadow-lg p-8 rounded-lg"
      >
        <h1 className="text-xl font-bold text-gray-800 mb-8 text-center">
          Add New Branch
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

        {/* Display school details if selected */}
        {selectedSchool && (
          <>
            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-semibold mb-2">
                School Name
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight"
                type="text"
                value={schoolName}
                readOnly
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-semibold mb-2">
                School Address
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight"
                type="text"
                value={schoolAddress}
                readOnly
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-semibold mb-2">
                School Phone Number
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight"
                type="text"
                value={schoolPhoneNumber}
                readOnly
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-semibold mb-2">
                School Email
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight"
                type="email"
                value={schoolEmail}
                readOnly
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-semibold mb-2">
                Established Date
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight"
                type="date"
                value={schoolEstablishedDate}
                readOnly
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-semibold mb-2">
                School Website
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight"
                type="text"
                value={schoolWebsite || "Website not available"}
                readOnly
              />
            </div>
          </>
        )}

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <Button className=" bg-[#213458] flex items-center justify-center hover:bg[#213498] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default Page;
