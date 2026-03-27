import React from 'react';

interface OrderIconProps {
  className?: string;
}

const OrderIcon: React.FC<OrderIconProps> = ({ className = "" }) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M36 23H10V37H36V23Z"
        stroke="var(--color-secondary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29 28H17"
        stroke="var(--color-secondary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 13C28.1046 13 29 12.1046 29 11C29 9.89543 28.1046 9 27 9C25.8954 9 25 9.89543 25 11C25 12.1046 25.8954 13 27 13Z"
        fill="var(--color-primary)"
      />
      <path
        d="M35 13C36.1046 13 37 12.1046 37 11C37 9.89543 36.1046 9 35 9C33.8954 9 33 9.89543 33 11C33 12.1046 33.8954 13 35 13Z"
        fill="var(--color-primary)"
      />
      <path
        d="M38 5H10C7.79086 5 6 6.79086 6 9V39C6 41.2091 7.79086 43 10 43H38C40.2091 43 42 41.2091 42 39V9C42 6.79086 40.2091 5 38 5Z"
        stroke="var(--color-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 11H18"
        stroke="var(--color-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 17H42"
        stroke="var(--color-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default OrderIcon;
