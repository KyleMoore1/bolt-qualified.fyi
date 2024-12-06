import React from 'react';
import { cn } from '../../utils/cn';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

export function IconButton({ 
  children, 
  variant = 'default',
  size = 'md',
  isActive = false,
  className,
  as = 'button',
  ...props 
}: IconButtonProps) {
  const Component = as as any;
  
  const variants = {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    primary: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700',
    success: 'bg-green-100 hover:bg-green-200 text-green-700',
  };

  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-1.5',
    lg: 'px-4 py-2',
  };

  return (
    <Component
      className={cn(
        'rounded-md font-medium transition-all duration-200 ease-in-out transform',
        'flex items-center gap-1.5',
        variants[variant],
        sizes[size],
        isActive && 'ring-2 ring-offset-2 ring-indigo-500',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}