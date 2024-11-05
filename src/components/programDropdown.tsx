"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ProgramDropdownProps {
  onSelect: (selectedPrograms: number[]) => void; // Prop to handle selected programs
  selectedPrograms?: number[]; // Prop to hold currently selected programs
}

const ProgramDropdown: React.FC<ProgramDropdownProps> = ({ onSelect, selectedPrograms = [] }) => {
  const router = useRouter();
  const [availablePrograms, setAvailablePrograms] = useState<any[]>([]);
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
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/`,
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
    const selectedValues = Array.from(e.target.selectedOptions, (option) => Number(option.value));
    onSelect(selectedValues); // Send the selected program IDs to the parent
  };

  return (
    <div className="w-full lg:w-[300px]">
      {error && <p className="text-red-500">{error}</p>}
      <select
        id="programs"
        name="programs"
        multiple // Enable multiple selection
        value={selectedPrograms.map(String)} // Convert selectedPrograms to strings for the select value
        onChange={handleProgramChange}
        className="mt-1 block w-full h-[40px] pl-3 pr-10 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select programs
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
