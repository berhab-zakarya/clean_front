import React from 'react'

interface ButtonType {
  title: string;
  className?: string;
}

const Button = ({ title, className = '' }: ButtonType) => {
  return (
    <button
      className={`bg-primary w-[173px] h-[58px] rounded-[32px] text-white text-[20px] leading-7 hover:bg-blue-700 transition-all duration-300 ${className}`}
    >
      {title}
    </button>
  )
}

export default Button
