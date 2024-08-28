import React from 'react'

interface ButtonProps {
  children: string;
}

const Button: React.FC<ButtonProps> = ({ children }) => {
  return (
    <button
      className='w-[348px] h-[59px] text-center text-black p-2 bg-white rounded-[5px] font-medium mt-4'
    >
      {children}
    </button>
  )
}

// export default Button

