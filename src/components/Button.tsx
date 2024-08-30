import React from 'react';

interface ButtonProps {
  children: string;
  bg?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, bg = 'primary' }) => {
  const Buttonbg = (bg: string) => {
    switch (bg) {
      case 'primary':
        return 'bg-[#213458]';
      case 'secondary':
        return 'bg-[#CF510E]';
      default:
        return '';
    }
  };
  const ButtonbgStyle = Buttonbg(bg);

  return (
    <button
      className={`w-[89px] h-[39px] text-center text-white p-2 rounded-[5px] font-medium mt-4 ${ButtonbgStyle}`}
    >
      {children}
    </button>
  );
};

export default Button;
