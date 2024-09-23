import React from 'react';

interface ButtonProps {
  children: string;
  bg?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void; // Corrected the type of onClick
}

const Button: React.FC<ButtonProps> = ({ children, bg = 'primary', className = '', onClick }) => {
  const getButtonBg = (bg: 'primary' | 'secondary') => {
    switch (bg) {
      case 'primary':
        return 'bg-[#213458]';
      case 'secondary':
        return 'bg-[#CF510E]';
      default:
        return '';
    }
  };

  const buttonBgStyle = getButtonBg(bg);

  return (
    <button
      onClick={onClick} // Ensuring onClick is passed to the button
      className={`w-[149px] h-[39px] text-center text-white p-2 font-medium ${buttonBgStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
