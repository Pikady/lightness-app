'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'small' | 'medium' | 'large';
  className?: string;
}

const StyledCard = styled(motion.div)<{
  $variant: 'default' | 'elevated' | 'outlined';
  $padding: 'small' | 'medium' | 'large';
  $clickable: boolean;
}>`
  border-radius: ${({ theme }) => theme.borderRadius.large};
  transition: all ${({ theme }) => theme.transitions.medium};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  position: relative;
  overflow: hidden;

  /* Padding variants */
  ${({ $padding, theme }) => {
    switch ($padding) {
      case 'small':
        return `padding: ${theme.spacing.md};`;
      case 'large':
        return `padding: ${theme.spacing.xl};`;
      default:
        return `padding: ${theme.spacing.lg};`;
    }
  }}

  /* Style variants */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'elevated':
        return `
          background-color: ${theme.colors.white};
          box-shadow: ${theme.shadows.medium};
          border: none;
        `;
      case 'outlined':
        return `
          background-color: transparent;
          border: 1px solid ${theme.colors.neutral};
          box-shadow: none;
        `;
      default:
        return `
          background-color: ${theme.colors.white};
          box-shadow: ${theme.shadows.soft};
          border: none;
        `;
    }
  }}

  /* Focus styles for clickable cards */
  ${({ $clickable }) =>
    $clickable &&
    `
    &:focus-visible {
      outline: none;
      animation: glow 1.5s ease-in-out infinite;
    }
  `}
`;

const Card: React.FC<CardProps> = ({
  children,
  onClick,
  variant = 'default',
  padding = 'medium',
  className,
}) => {
  const isClickable = !!onClick;

  return (
    <StyledCard
      className={className}
      onClick={onClick}
      $variant={variant}
      $padding={padding}
      $clickable={isClickable}
      whileHover={
        isClickable
          ? {
              y: -4,
              boxShadow: '0 12px 32px rgba(74, 68, 63, 0.12)',
            }
          : {}
      }
      whileTap={
        isClickable
          ? {
              y: -2,
              scale: 0.98,
            }
          : {}
      }
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
    >
      {children}
    </StyledCard>
  );
};

export default Card;