import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'sm';
  full?: boolean;
}

export function Button({ variant = 'primary', size = 'md', full = false, type = 'button', className = '', ...props }: ButtonProps) {
  return <button {...props} type={type} className={`btn btn--${variant} btn--${size} ${full ? 'btn--full' : ''} ${className}`} />;
}
