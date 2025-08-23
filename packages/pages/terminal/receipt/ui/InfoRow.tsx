import React from 'react';

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, className = '' }) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-[24px] text-[#A3A5AE] leading-[34px] font-medium">{label}</span>
      {typeof value === 'string' ? (
        <span className="text-[24px] text-[#0047FF] leading-[33px] font-medium">{value}</span>
      ) : (
        value
      )}
    </div>
  );
};

export default InfoRow;
