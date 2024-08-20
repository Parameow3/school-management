import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Searchinput = () => {
  return (
    <div className="flex items-center border border-gray-300 p-2 rounded-md m-3">
      <input
        type="text"
        className="outline-none border-none bg-transparent text-gray-200 placeholder-gray-300
                   w-[197px] h-[22px] 
                   md:w-[300px] md:h-[40px]
                   lg:w-[421px] lg:h-[27px]"
        placeholder="Search..."
      />
      <MagnifyingGlassIcon className="h-6 w-6 text-gray-300 ml-2" />
    </div>
  );
};

export default Searchinput;
