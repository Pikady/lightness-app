'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled(motion.button)<{
  $variant: 'primary' | 'secondary';
  $size: 'small' | 'medium' | 'large';
  $disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all ${({ theme }) => theme.transitions.medium};
  position: relative;
  outline: none;

  /* Size variants */
  ${({ $size, theme }) => {
    switch ($size) {
      case 'small':
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: 0.875rem;
          min-height: 36px;
        `;
      case 'large':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: 1.125rem;
          min-height: 52px;
        `;
      default:
        return `
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: 1rem;
          min-height: 44px;
        `;
    }
  }}

  /* Color variants */
  ${({ $variant, $disabled, theme }) => {
    if ($disabled) {
      return `
        background-color: #FADBC0;
        color: ${theme.colors.text}80;
        box-shadow: none;
      `;
    }

    switch ($variant) {
      case 'secondary':
        return `
          background-color: ${theme.colors.white};
          color: ${theme.colors.text};
          box-shadow: ${theme.shadows.soft};
          border: 1px solid ${theme.colors.neutral};
        `;
      default:
        return `
          background-color: ${theme.colors.primary};
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

  /* Hover and active states handled by Framer Motion */
`;

const CapsuleButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  type = 'button',
}) => {
  return (
    <StyledButton
      type={type}
      onClick={disabled ? undefined : onClick}
      $variant={variant}
      $size={size}
      $disabled={disabled}
      whileHover={
        disabled
          ? {}
          : {
              y: -2,
              boxShadow: '0 8px 24px rgba(74, 68, 63, 0.16)',
            }
      }
      whileTap={
        disabled
          ? {}
          : {
              y: -1,
              scale: 0.98,
              boxShadow: 'none',
            }
      }
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
    >
      {children}
    </StyledButton>
  );
};

export default CapsuleButton;