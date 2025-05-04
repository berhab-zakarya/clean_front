import { fontFamily } from "@/lib/fonts";
import Image from "next/image";
import { useState, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  text?: string;
}

const ButtonWithIcon: React.FC<ButtonProps> = ({
  children,
  className = "",
  text = "Launch your store",
  onClick,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`
        flex items-center ${!isHovered ? 'justify-center' : ''}
        ${isHovered ? "bg-[#F97316] w-64 h-16" : "bg-[#1E3A8A] w-44 h-14"}
        rounded-full cursor-pointer text-xl text-center text-white ${fontFamily}
        transition-all duration-500 ease-in-out
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      <div
        className={`
        flex items-center justify-center
        transition-all duration-500 ease-in-out
        ${isHovered ? "opacity-100 mr-3 " : "opacity-0 w-0 "}
      `}
      >
        <Image
          width={50}
          height={50}
          alt="Launch icon"
          src="/assets/icons/circle_chev.svg"
          className="transition-all ml-1  duration-500 ease-in-out"
        />
      </div>

      <span className="whitespace-nowrap text-center">{text || children}</span>
    </button>
  );
};

export default ButtonWithIcon;
