import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/solid';
const Dropdown = () => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-[#213458] px-3 py-2 text-sm font-semibold text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300">
          Branch
          <ChevronUpIcon aria-hidden="true" className="-mr-1 h-5 w-10 text-gray-200" />
        </MenuButton>
      </div>

      <MenuItems
        className="absolute z-50 mt-2 w-56  origin-top-right rounded-md bg-[#213458] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div className="py-1">
          <MenuItem>
            {({ active }) => (
              <a
                href="#"
                className={`block px-4 py-2 text-sm text-gray-200 ${
                  active ? 'bg-[#213458] text-white' : ''
                }`}
              >
                Fun Mall
              </a>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <a
                href="#"
                className={`block px-4 py-2 text-sm text-gray-200 ${
                  active ? 'bg-[#213458] text-white' : ''
                }`}
              >
                OCIC
              </a>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <a
                href="#"
                className={`block px-4 py-2 text-sm text-gray-200 ${
                  active ? 'bg-[#213458] text-white' : ''
                }`}
              >
                PH
              </a>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  )
}

export default Dropdown;
