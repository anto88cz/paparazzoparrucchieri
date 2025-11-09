'use client';

import Link from 'next/link';
import { trackWhatsAppClick } from '@/lib/whatsapp';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  external?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  disabled = false,
  external = false,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-600 hover:to-gold-700 focus:ring-gold-500 shadow-lg hover:shadow-xl',
    secondary:
      'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700 shadow-md hover:shadow-lg',
    outline:
      'border-2 border-gold-500 text-gold-600 hover:bg-gold-50 focus:ring-gold-500',
    whatsapp:
      'bg-[#25D366] text-white hover:bg-[#128C7E] focus:ring-[#25D366] shadow-lg hover:shadow-xl',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${
    fullWidth ? 'w-full' : ''
  } ${className}`;

  const handleClick = () => {
    if (variant === 'whatsapp') {
      trackWhatsAppClick('button');
    }
    onClick?.();
  };

  if (href) {
    if (external || href.startsWith('http')) {
      return (
        <a
          href={href}
          className={classes}
          onClick={handleClick}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        <span onClick={handleClick} className="flex items-center justify-center w-full h-full">
          {children}
        </span>
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={handleClick} disabled={disabled}>
      {children}
    </button>
  );
}
