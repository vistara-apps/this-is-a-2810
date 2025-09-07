import React from 'react'

const Input = ({ 
  type = 'text',
  variant = 'default',
  className = '',
  ...props 
}) => {
  const baseClasses = 'block w-full rounded-md border-0 py-2 px-3 text-white placeholder:text-white/60 focus:ring-2 focus:ring-accent sm:text-sm transition-all duration-200'
  
  const variants = {
    default: 'bg-white/10 backdrop-blur-md border border-white/20 focus:bg-white/15',
    textarea: 'bg-white/10 backdrop-blur-md border border-white/20 focus:bg-white/15 resize-none'
  }

  if (variant === 'textarea') {
    return (
      <textarea
        className={`${baseClasses} ${variants[variant]} ${className}`}
        {...props}
      />
    )
  }

  return (
    <input
      type={type}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    />
  )
}

export default Input