'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
  size?: 'small' | 'medium';
}

const StyledBadge = styled(motion.span)<{
  $variant: 'default' | 'success' | 'warning' | 'info';
  $size: 'small' | 'medium';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  white-space: nowrap;

  /* Size variants */
  ${({ $size, theme }) => {
    switch ($size) {
      case 'small':
        return `
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: 0.75rem;
          min-height: 20px;
        `;
      default:
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: 0.875rem;
          min-height: 24px;
        `;
    }
  }}

  /* Color variants */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'success':
        return `
          background-color: #E8F5E8;
          color: #2E7D32;
        `;
      case 'warning':
        return `
          background-color: #FFF3E0;
          color: #F57C00;
        `;
      case 'info':
        return `
          background-color: #E3F2FD;
          color: #1976D2;
        `;
      default:
        return `
          background-color: ${theme.colors.neutral};
          color: ${theme.colors.text};
        `;
    }
  }}
`;

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium',
}) => {
  return (
    <StyledBadge
      $variant={variant}
      $size={size}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
    >
      {children}
    </StyledBadge>
  );
};

export default Badge;