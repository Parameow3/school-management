"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ProgramDropdown = () => {
  const [availablePrograms, setAvailablePrograms] = useState<any[]>([]); // Store the fetched programs
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null); // Store the selected program

  // Fetch programs when the component is mounted
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/academics/program/?page=1");
        setAvailablePrograms(response.data.results); // Assuming programs are in the `results` array
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProgram(Number(e.target.value)); // Update the selected program
  };

  return (
    <div className="w-full lg:w-[300px]">
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
        {availablePrograms.map((program) => (
          <option key={program.id} value={program.id}>
            {program.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProgramDropdown;
