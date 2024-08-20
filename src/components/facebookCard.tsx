import React from 'react';

const FacebookCard: React.FC = () => {
  return (
    <div className="flex items-center mt-4 w-[330px] h-[128px] justify-between p-4 bg-[#213458] text-white rounded-lg max-w-sm">
      <div className="flex items-center">
        <div className="bg-white rounded-full p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="h-6 w-6 text-blue-900"
          >
            <path
              d="M22.675 0H1.325C.595 0 0 .592 0 1.319v21.362C0 23.407.595 24 1.325 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.097 1.894-4.787 4.66-4.787 1.325 0 2.463.099 2.794.144v3.238l-1.917.001c-1.503 0-1.794.714-1.794 1.762v2.309h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.324-.593 1.324-1.319V1.319C24 .592 23.404 0 22.675 0z"
            />
          </svg>
        </div>
        <span className="ml-4 text-sm font-medium">Like Us on Facebook</span>
      </div>
      <div aria-hidden="true" className="h-6 w-px ml-2 bg-gray-200" />
      <span className="text-sm font-medium">2300</span>
    </div>
  );
};

export default FacebookCard;
