'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const StickyNoteContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 2rem auto;
`;

const StickyNoteWrapper = styled(motion.div)`
  background: ${({ theme }) => theme.colors.accentYellow};
  border-radius: 0 0 8px 8px;
  padding: 2rem;
  box-shadow: 
    0 4px 12px rgba(254, 234, 145, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  transform: rotate(-1deg);
  
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 20px;
    right: 20px;
    height: 8px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(0, 0, 0, 0.1) 20%, 
      rgba(0, 0, 0, 0.1) 80%, 
      transparent 100%
    );
    border-radius: 4px 4px 0 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 20px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 0 0 8px 8px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const HandwrittenTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.handwriting};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  text-align: center;
  line-height: 1.4;
  transform: rotate(0.5deg);
`;

const TaskPreview = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
`;

const TextArea = styled(motion.textarea)`
  width: 100%;
  min-height: 120px;
  background: transparent;
  border: none;
  outline: none;
  font-family: ${({ theme }) => theme.fonts.handwriting};
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
  line-height: 1.6;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text};
    opacity: 0.5;
    font-style: italic;
  }
  
  &:focus {
    outline: none;
  }
`;

const LinePattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.1;
  
  &::before {
    content: '';
    position: absolute;
    top: 80px;
    left: 2rem;
    right: 2rem;
    bottom: 2rem;
    background-image: repeating-linear-gradient(
      transparent,
      transparent 1.4rem,
      ${({ theme }) => theme.colors.text} 1.4rem,
      ${({ theme }) => theme.colors.text} calc(1.4rem + 1px)
    );
  }
`;

interface StickyNoteProps {
  task: string;
  value: string;
  onChange: (value: string) => void;
}

export function StickyNote({ task, value, onChange }: StickyNoteProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <StickyNoteContainer>
      <StickyNoteWrapper
        initial={{ 
          scale: 0.8, 
          rotate: -5, 
          opacity: 0,
          y: 20 
        }}
        animate={{ 
          scale: 1, 
          rotate: -1, 
          opacity: 1,
          y: 0 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20,
          duration: 0.6 
        }}
        whileHover={{
          rotate: 0,
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        <LinePattern />
        
        <HandwrittenTitle>
          如果这事好玩，会是什么样子？
        </HandwrittenTitle>
        
        <TaskPreview>
          📝 当前任务：{task}
        </TaskPreview>
        
        <TextArea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="比如：像探险家一样整理房间，每个角落都是一个新发现的宝藏地点..."
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </StickyNoteWrapper>
    </StickyNoteContainer>
  );
}