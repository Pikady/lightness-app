'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

interface SincereSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const SwitchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const Switch = styled(motion.div)<{ 
  $isOn: boolean; 
  $size: 'small' | 'medium' | 'large' 
}>`
  width: ${({ $size }) => {
    switch ($size) {
      case 'small': return '80px';
      case 'large': return '140px';
      default: return '120px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'small': return '40px';
      case 'large': return '70px';
      default: return '60px';
    }
  }};
  background: ${({ theme, $isOn }) => 
    $isOn ? theme.colors.accentGreen : theme.colors.neutral
  };
  border-radius: ${({ $size }) => {
    switch ($size) {
      case 'small': return '20px';
      case 'large': return '35px';
      default: return '30px';
    }
  }};
  padding: ${({ $size }) => {
    switch ($size) {
      case 'small': return '3px';
      case 'large': return '5px';
      default: return '4px';
    }
  }};
  cursor: pointer;
  position: relative;
  transition: background-color 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: ${({ $isOn, theme }) => 
    $isOn 
      ? `0 0 20px ${theme.colors.accentGreen}40`
      : '0 2px 8px rgba(0, 0, 0, 0.1)'
  };
`;

const SwitchKnob = styled(motion.div)<{ $size: 'small' | 'medium' | 'large' }>`
  width: ${({ $size }) => {
    switch ($size) {
      case 'small': return '34px';
      case 'large': return '60px';
      default: return '52px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'small': return '34px';
      case 'large': return '60px';
      default: return '52px';
    }
  }};
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'small': return '0.7rem';
      case 'large': return '1rem';
      default: return '0.9rem';
    }
  }};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const ModeLabels = styled.div<{ $size: 'small' | 'medium' | 'large' }>`
  display: flex;
  justify-content: space-between;
  width: ${({ $size }) => {
    switch ($size) {
      case 'small': return '80px';
      case 'large': return '140px';
      default: return '120px';
    }
  }};
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'small': return '0.7rem';
      case 'large': return '1rem';
      default: return '0.9rem';
    }
  }};
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
  font-family: ${({ theme }) => theme.fonts.body};
`;

export function SincereSwitch({ 
  isOn, 
  onToggle, 
  showLabels = true, 
  size = 'medium' 
}: SincereSwitchProps) {
  const getKnobDistance = () => {
    switch (size) {
      case 'small': return 40;
      case 'large': return 70;
      default: return 60;
    }
  };

  return (
    <SwitchContainer>
      <Switch
        $isOn={isOn}
        $size={size}
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SwitchKnob
          $size={size}
          animate={{
            x: isOn ? getKnobDistance() : 0,
            scale: isOn ? 1.15 : 1
          }}
          transition={{
            type: "tween",
            duration: 0.4,
            ease: "easeInOut"
          }}
        >
          {isOn ? '真诚' : '认真'}
        </SwitchKnob>
      </Switch>
      
      {showLabels && (
        <ModeLabels $size={size}>
          <span>认真</span>
          <span>真诚</span>
        </ModeLabels>
      )}
    </SwitchContainer>
  );
}