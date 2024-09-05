import React, { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/solid';

interface DropdownProps {
  onChange?: (value: string) => void;
  value?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ onChange = () => {} }) => {
  const [selectedValue, setSelectedValue] = useState('Branch');

  const handleSelect = (value: string) => {
    setSelectedValue(value); // Update the displayed value
    onChange(value); // Call the onChange handler if provided
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex lg:w-[225px] w-[329px] h-[40px] justify-between gap-x-1.5 rounded-md bg-[#FFFFFF] px-3 py-2 text-sm font-semibold text-[#213458] shadow-sm ring-1 ring-inset ring-gray-300">
          {selectedValue}
          <ChevronUpIcon aria-hidden="true" className="-mr-1 h-5 w-10 text-[#213458]" />
        </MenuButton>
      </div>

      <MenuItems className="absolute z-50 lg:w-56 origin-top-right rounded-md mt-2 bg-[#FFFFFF] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <MenuItem>
            {({ active }) => (
              <button
                type="button"
                onClick={() => handleSelect('Fun Mall')}
                className={`block px-4 py-2 text-sm text-[#213458] ${
                  active ? ' text-[#213458]' : ''
                }`}
              >
                Fun Mall
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <button
                type="button"
                onClick={() => handleSelect('OCIC')}
                className={`block px-4 py-2 text-sm text-[#213458] ${
                  active ? ' text-[#213458]' : ''
                }`}
              >
                OCIC
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <button
                type="button"
                onClick={() => handleSelect('PH')}
                className={`block px-4 py-2 text-sm text-[#213458] ${
                  active ? ' text-[#213458]' : ''
                }`}
              >
                PH
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default Dropdown;
