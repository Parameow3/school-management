"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Branch {
  id: number;
  name: string;
}

interface DropdownProps {
  onChange?: (value: number | null) => void; // Allow null for "All" selection
  value?: number | null; // Optionally allow a pre-selected value, including "All" as null
}

const Dropdown: React.FC<DropdownProps> = ({ onChange = () => {}, value }) => {
  const router = useRouter();
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(value || null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch the token from localStorage when the component mounts
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      // Redirect to login if no token is found
      router.push("/login");
    }
  }, [router]);

  // Fetch branches once the token is available
  useEffect(() => {
    const fetchBranches = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/branches/`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Add the token in headers
              },
            }
          );
          const branchesData = response.data.results.map((item: any) => ({
            id: item.id,
            name: item.name,
          }));

          // Add "All" option to the branches list
          setAvailableBranches([{ id: 0, name: "All" }, ...branchesData]);
          setError(null); // Reset any previous errors
        } catch (error) {
          console.error("Error fetching branches:", error);
          setError("Failed to fetch branches.");
          setAvailableBranches([]); // Set an empty array in case of error
        }
      }
    };

    fetchBranches();
  }, [token]);

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value === "0" ? null : Number(e.target.value);
    setSelectedBranch(selectedValue); // Store the selected branch (or "All" as null)
    onChange(selectedValue);
  };

  return (
    <div className="w-full lg:w-[200px]">
      <select
        id="branches"
        name="branches"
        value={selectedBranch === null ? "0" : selectedBranch}
        onChange={handleBranchChange}
        className="mt-1 block w-full h-[40px] pl-3 pr-10 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableBranches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default Dropdown;
