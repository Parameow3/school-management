import React, { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/solid';
interface DropdownProps {
  onChange?: (value: number) => void;
  value?: number;
}
const Dropdown: React.FC<DropdownProps> = ({ onChange = () => {} }) => {
  const [selectedValue, setSelectedValue] = useState<string | number>('Branch');

  const handleSelect = (value:number) => {
    setSelectedValue(value); 
    onChange(value); 
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
                onClick={() => handleSelect(1)}
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
                onClick={() => handleSelect(2)}
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
                onClick={() => handleSelect(3)}
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