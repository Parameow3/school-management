// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// type ProgramDropdownProps = {
//   onSelect: (selectedPrograms: number[]) => void;
//   selectedPrograms: number[];
// };

// const ProgramDropdown: React.FC<ProgramDropdownProps> = ({ onSelect, selectedPrograms }) => {
//   const router = useRouter();
//   const [availablePrograms, setAvailablePrograms] = useState<any[]>([]);
//   const [token, setToken] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const tokenFromLocalStorage = localStorage.getItem("authToken");
//     if (tokenFromLocalStorage) {
//       setToken(tokenFromLocalStorage);
//     } else {
//       router.push("/login");
//     }
//   }, [router]);

//   useEffect(() => {
//     const fetchPrograms = async () => {
//       if (token) {
//         try {
//           const response = await axios.get(
//             `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           setAvailablePrograms(response.data.results);
//         } catch (error) {
//           console.error("Error fetching programs:", error);
//           setError("Failed to fetch programs.");
//         }
//       }
//     };

//     fetchPrograms();
//   }, [token]);

//   const handleProgramChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedOptions = Array.from(event.target.selectedOptions, option => parseInt(option.value, 10));
//     onSelect(selectedOptions);
//   };

//   return (
//     <div>
//       <select
//         id="program"
//         name="program"
//         value={selectedPrograms.map(String)}
//         onChange={handleProgramChange}
//         className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
//         required
//         multiple
//       >
//         <option value="" disabled>
//           Select a program
//         </option>
//         {availablePrograms.map((program) => (
//           <option key={program.id} value={program.id}>
//             {program.name}
//           </option>
//         ))}
//       </select>
//       {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
//     </div>
//   );
// };

// export default ProgramDropdown;
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type ProgramDropdownProps = {
  onSelect: (selectedPrograms: number[]) => void;
  selectedPrograms: number[];
};

const ProgramDropdown: React.FC<ProgramDropdownProps> = ({ onSelect, selectedPrograms }) => {
  const router = useRouter();
  const [availablePrograms, setAvailablePrograms] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setAvailablePrograms(response.data.results);
        } catch (error) {
          console.error("Error fetching programs:", error);
          setError("Failed to fetch programs.");
        }
      }
    };

    fetchPrograms();
  }, [token]);

  const handleProgramChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => parseInt(option.value, 10));
    onSelect(selectedOptions);
  };

  return (
    <div>
      <select
        id="program"
        name="program"
        value={selectedPrograms.map(String)}
        onChange={handleProgramChange}
        className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
        required
        multiple
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
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default ProgramDropdown;