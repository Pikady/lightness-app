'use client';

import React, { useState, forwardRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  autoFocus?: boolean;
}

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input<{ $hasValue: boolean; $isFocused: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  border: none;
  outline: none;
  caret-color: ${({ theme }) => theme.colors.text};

  /* 自定义光标动画 */
  animation: ${({ $isFocused }) => ($isFocused ? 'breathe 2s ease-in-out infinite' : 'none')};

  &::placeholder {
    color: transparent;
  }
`;

const StyledTextarea = styled.textarea<{ $hasValue: boolean; $isFocused: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  border: none;
  outline: none;
  resize: vertical;
  min-height: 120px;
  caret-color: ${({ theme }) => theme.colors.text};

  /* 自定义光标动画 */
  animation: ${({ $isFocused }) => ($isFocused ? 'breathe 2s ease-in-out infinite' : 'none')};

  &::placeholder {
    color: transparent;
  }
`;

const Label = styled(motion.label)<{ $hasValue: boolean; $isFocused: boolean }>`
  position: absolute;
  left: 0;
  top: ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.fonts.body};
  color: ${({ theme }) => theme.colors.text}99;
  pointer-events: none;
  transform-origin: left top;
  transition: all ${({ theme }) => theme.transitions.medium};

  ${({ $hasValue, $isFocused, theme }) =>
    $hasValue || $isFocused
      ? `
        transform: translateY(-24px) scale(0.875);
        color: ${theme.colors.primary};
      `
      : ''}
`;

const Underline = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.neutral};
`;

const UnderlineActive = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 50%;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.primary};
  transform-origin: center;
`;

const InputField = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      placeholder = '',
      value = '',
      onChange,
      onKeyDown,
      disabled = false,
      multiline = false,
      rows = 4,
      autoFocus = false,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value.length > 0;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <InputContainer>
        {multiline ? (
          <StyledTextarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            disabled={disabled}
            autoFocus={autoFocus}
            rows={rows}
            $hasValue={hasValue}
            $isFocused={isFocused}
          />
        ) : (
          <StyledInput
            ref={ref as React.RefObject<HTMLInputElement>}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            disabled={disabled}
            autoFocus={autoFocus}
            $hasValue={hasValue}
            $isFocused={isFocused}
          />
        )}
        <Label
          $hasValue={hasValue}
          $isFocused={isFocused}
          initial={false}
          animate={{
            y: hasValue || isFocused ? -24 : 0,
            scale: hasValue || isFocused ? 0.875 : 1,
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {placeholder}
        </Label>
        <Underline />
        <UnderlineActive
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ x: '-50%' }}
        />
      </InputContainer>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;