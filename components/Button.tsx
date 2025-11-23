import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "rounded-2xl font-bold transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none";
  
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-400 border-b-4 border-blue-700",
    secondary: "bg-purple-500 text-white hover:bg-purple-400 border-b-4 border-purple-700",
    success: "bg-green-500 text-white hover:bg-green-400 border-b-4 border-green-700",
    danger: "bg-red-500 text-white hover:bg-red-400 border-b-4 border-red-700",
    outline: "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 shadow-none hover:shadow-md"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl w-full"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};