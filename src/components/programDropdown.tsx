"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ProgramDropdownProps {
  onSelect: (selectedPrograms: number[]) => void;
}

const ProgramDropdown: React.FC<ProgramDropdownProps> = ({ onSelect }) => {
  const router = useRouter();
  const [availablePrograms, setAvailablePrograms] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch the token from localStorage when the component mounts
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      // Redirect to login if no token
      router.push("/login");
    }
  }, [router]);

  // Fetch programs once the token is available
  useEffect(() => {
    const fetchPrograms = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/academics/program/",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Add the token in headers
              },
            }
          );
          setAvailablePrograms(response.data.results); // Assuming programs are in the `results` array
        } catch (error) {
          console.error("Error fetching programs:", error);
          setError("Failed to fetch programs.");
        }
      }
    };

    fetchPrograms();
  }, [token]); // Trigger when the token is available

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = Number(e.target.value);
    setSelectedProgram(selectedValue); // Store the selected program as a number
    onSelect([selectedValue]); // Send the selected program ID to the parent as an array
  };

  return (
    <div className="w-full lg:w-[300px]">
      {error && <p className="text-red-500">{error}</p>}
      <select
        id="programs"
        name="programs"
        value={selectedProgram ?? ""} // Set the selected value, or default to an empty string
        onChange={handleProgramChange}
        className="mt-1 block w-full h-[40px] pl-3 pr-10 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select a program
        </option>
        {availablePrograms.length > 0 ? (
          availablePrograms.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))
        ) : (
          <option value="" disabled>
            No programs available
          </option>
        )}
      </select>
    </div>
  );
};

export default ProgramDropdown;
