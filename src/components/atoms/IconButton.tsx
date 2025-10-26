'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'ghost';
  'aria-label'?: string;
}

const StyledIconButton = styled(motion.button)<{
  $size: 'small' | 'medium' | 'large';
  $variant: 'default' | 'ghost';
  $disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all ${({ theme }) => theme.transitions.medium};
  position: relative;
  outline: none;

  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return `
          width: 32px;
          height: 32px;
        `;
      case 'large':
        return `
          width: 48px;
          height: 48px;
        `;
      default:
        return `
          width: 40px;
          height: 40px;
        `;
    }
  }}

  /* Style variants */
  ${({ $variant, $disabled, theme }) => {
    if ($disabled) {
      return `
        background-color: ${theme.colors.neutral};
        color: ${theme.colors.text}40;
        box-shadow: none;
      `;
    }

    switch ($variant) {
      case 'ghost':
        return `
          background-color: transparent;
          color: ${theme.colors.text};
          
          &:hover {
            background-color: ${theme.colors.neutral};
          }
        `;
      default:
        return `
          background-color: ${theme.colors.white};
          color: ${theme.colors.text};
          box-shadow: ${theme.shadows.soft};
        `;
    }
  }}

  /* Focus styles */
  &:focus-visible {
    outline: none;
    animation: glow 1.5s ease-in-out infinite;
  }

  /* Icon sizing */
  svg {
    ${({ $size }) => {
      switch ($size) {
        case 'small':
          return 'width: 16px; height: 16px;';
        case 'large':
          return 'width: 24px; height: 24px;';
        default:
          return 'width: 20px; height: 20px;';
      }
    }}
  }
`;

const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  disabled = false,
  size = 'medium',
  variant = 'default',
  'aria-label': ariaLabel,
}) => {
  return (
    <StyledIconButton
      onClick={disabled ? undefined : onClick}
      $size={size}
      $variant={variant}
      $disabled={disabled}
      aria-label={ariaLabel}
      whileHover={
        disabled
          ? {}
          : {
              y: -2,
              boxShadow: variant === 'default' ? '0 8px 24px rgba(74, 68, 63, 0.16)' : undefined,
            }
      }
      whileTap={
        disabled
          ? {}
          : {
              y: -1,
              scale: 0.95,
            }
      }
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
    >
      {children}
    </StyledIconButton>
  );
};

export default IconButton;