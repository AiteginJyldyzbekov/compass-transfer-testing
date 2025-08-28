import React from 'react';

interface FooterSpacerProps {
  className?: string;
}

export function FooterSpacer({ className = '' }: FooterSpacerProps) {
  return (
    <div 
      className={`h-20 pb-safe-area-inset-bottom ${className}`}
      aria-hidden="true"
    />
  );
}
