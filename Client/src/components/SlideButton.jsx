import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MotionLink = motion.create(Link);

const SlideButton = ({ 
  children, 
  onClick, 
  to,
  variant = 'primary', 
  icon: Icon = ArrowRight,
  className = '',
  type = 'button',
  disabled = false
}) => {
  const isPrimary = variant === 'primary';
  
  const baseClasses = isPrimary 
    ? 'flex-button-primary' 
    : 'flex-button-secondary';

  const containerVariants = {
    initial: {},
    hover: {},
    tap: { scale: 0.97 }
  };

  const textVariants = {
    initial: { x: 0 },
    hover: { x: -8 }
  };

  const iconVariants = {
    initial: { x: 15, opacity: 0 },
    hover: { x: 0, opacity: 1 }
  };

  const commonProps = {
    initial: "initial",
    whileHover: "hover",
    whileTap: "tap",
    variants: containerVariants,
    className: `relative group overflow-hidden ${baseClasses} ${className} min-h-[44px]`,
    style: { isolation: 'isolate' }
  };

  if (to) {
    return (
      <MotionLink to={to} {...commonProps}>
        <motion.span 
          variants={textVariants}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 flex items-center justify-center gap-2"
        >
          {children}
        </motion.span>
        <motion.span
          variants={iconVariants}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute right-5 z-10 flex items-center justify-center"
        >
          <Icon size={16} strokeWidth={2.5} />
        </motion.span>
        {isPrimary && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-blue-600 shadow-inner -z-10"
          />
        )}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...commonProps}
    >
      <motion.span 
        variants={textVariants}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-10 flex items-center justify-center gap-2"
      >
        {children}
      </motion.span>
      <motion.span
        variants={iconVariants}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute right-5 z-10 flex items-center justify-center"
      >
        <Icon size={16} strokeWidth={2.5} />
      </motion.span>
      {isPrimary && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-blue-600 shadow-inner -z-10"
        />
      )}
    </motion.button>
  );
};

export default SlideButton;
