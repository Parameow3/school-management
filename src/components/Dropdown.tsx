import React, { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/solid';

interface Branch {
  id: number;
  name: string;
}

interface DropdownProps {
  onChange?: (value: number) => void;
  value?: number;
}

const Dropdown: React.FC<DropdownProps> = ({ onChange = () => {} }) => {
  const [selectedValue, setSelectedValue] = useState<string | number>('Branch');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  
  useEffect(() => {
    // Fetch branches from the API
    const fetchBranches = async () => {
      const token = localStorage.getItem('authToken'); // Get token from localStorage
      if (!token) {
        console.error('Token is missing');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/branches/', {
          headers: {
            Authorization: `Bearer ${token}`, // Set the token in the Authorization header
          },
        });
        const data = await response.json();
        setBranches(data.results || []); // Ensure branches is an array
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching branches:', error);
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleSelect = (value: number) => {
    setSelectedValue(value); 
    onChange(value); 
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex lg:w-[225px] w-[329px] h-[40px] justify-between gap-x-1.5 rounded-md bg-[#FFFFFF] px-3 py-2 text-sm font-semibold text-[#213458] shadow-sm ring-1 ring-inset ring-gray-300">
          {isLoading ? 'Loading...' : selectedValue}
          <ChevronUpIcon aria-hidden="true" className="-mr-1 h-5 w-10 text-[#213458]" />
        </MenuButton>
      </div>

      {!isLoading && branches.length > 0 && ( // Safely check if branches has data
        <MenuItems className="absolute z-50 lg:w-56 origin-top-right rounded-md mt-2 bg-[#FFFFFF] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {branches.map(branch => (
              <MenuItem key={branch.id}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => handleSelect(branch.id)}
                    className={`block px-4 py-2 text-sm text-[#213458] ${active ? 'text-[#213458]' : ''}`}
                  >
                    {branch.name}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      )}
    </Menu>
  );
};

export default Dropdown;
