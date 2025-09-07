import React from 'react'

const Card = ({ children, className = '', variant = 'default', ...props }) => {
  const baseClasses = 'rounded-lg transition-all duration-200'
  
  const variants = {
    default: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-card',
    elevated: 'bg-white/15 backdrop-blur-md border border-white/30 shadow-modal hover:shadow-xl'
  }

  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card