import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white focus:ring-primary/50',
    secondary: 'bg-white/20 hover:bg-white/30 text-white border border-white/30 focus:ring-white/50',
    outline: 'bg-transparent hover:bg-white/10 text-white border border-white/30 focus:ring-white/50',
    icon: 'bg-white/10 hover:bg-white/20 text-white rounded-full p-2'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button