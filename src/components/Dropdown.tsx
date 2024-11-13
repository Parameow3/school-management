"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Branch {
  id: number;
  name: string;
}

interface DropdownProps {
  onChange?: (value: number) => void; // Callback to notify the parent of the selected value
  value?: number; // Optionally allow a pre-selected value
}

const Dropdown: React.FC<DropdownProps> = ({ onChange = () => {}, value }) => {
  const router = useRouter();
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]); // Initialize as an empty array
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
            id: item.id, // Assuming `id` is the branch ID
            name: item.name, // Assuming `name` is the branch name
          }));

          if (branchesData.length > 0) {
            setAvailableBranches(branchesData); // Set the branches array
            setError(null); // Reset any previous errors
          } else {
            setAvailableBranches([]); // Set an empty array if no results
            setError("No branches available.");
          }
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
    const selectedValue = Number(e.target.value);
    setSelectedBranch(selectedValue); // Store the selected branch as a number
    onChange(selectedValue); 
  };

  return (
    <div className="w-full lg:w-[300px]">
      <select
        id="branches"
        name="branches"
        value={selectedBranch ?? ""} // Set the selected value, or default to an empty string
        onChange={handleBranchChange}
        className="mt-1 block w-full h-[40px] pl-3 pr-10 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select a Branch
        </option>
        {availableBranches.length > 0 ? (
          availableBranches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name} {/* Show branch name here */}
            </option>
          ))
        ) : (
          <option value="" disabled>
            No branch available
          </option>
        )}
      </select>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default Dropdown;
