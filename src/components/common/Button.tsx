import { fontFamily } from '@/lib/fonts';
import { useState, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', onClick, ...rest }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button 
      className={` 
        ${isHovered ? 'bg-[#F97316] w-52 h-16' : 'bg-[#1E3A8A] w-44 h-14'} 
        rounded-full cursor-pointer text-xl  ${fontFamily} text-white transition-all duration-300 ease-in-out
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;