'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  Search, 
  Trophy, 
  Compass, 
  Lightbulb, 
  BookOpen, 
  Smile, 
  Crown, 
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const SelectorContainer = styled.div`
  width: 100%;
  max-width: 750px; /* 增大最大宽度，从500px调整到750px */
  margin: 0 auto;
  position: relative;
`;

const SelectorTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.3rem; /* 增大标题字体 */
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 2rem;
  opacity: 0.8;
`;

const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 60px; /* 增加渐变宽度 */
    z-index: 2;
    pointer-events: none;
  }
  
  &::before {
    left: 0;
    background: linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%);
  }
  
  &::after {
    right: 0;
    background: linear-gradient(to left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%);
  }
`;

const PersonaGrid = styled.div`
  display: flex;
  gap: 1.5rem; /* 增大卡片间距 */
  padding: 1rem 3rem; /* 增加左右padding为箭头留空间 */
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* 触摸滚动优化 */
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
`;

const PersonaCard = styled(motion.div)<{ selected: boolean }>`
  flex: 0 0 140px; /* 调整卡片宽度，因为移除了描述文字 */
  width: 140px; /* 调整卡片宽度 */
  height: 140px; /* 调整卡片高度，因为移除了描述文字 */
  background: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.white};
  border: 2px solid ${({ selected, theme }) => 
    selected ? theme.colors.primary : 'transparent'};
  border-radius: 20px; /* 增大圆角 */
  padding: 1rem; /* 调整内边距 */
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  scroll-snap-align: center;
  box-shadow: ${({ selected }) => 
    selected 
      ? '0 8px 25px rgba(249, 181, 114, 0.3), 0 3px 10px rgba(0, 0, 0, 0.1)'
      : '0 4px 12px rgba(0, 0, 0, 0.08)'
  };
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.1) 0%, 
      transparent 50%
    );
    pointer-events: none;
  }
`;

const PersonaIcon = styled.div<{ selected: boolean }>`
  width: 56px; /* 增大图标容器 */
  height: 56px; /* 增大图标容器 */
  border-radius: 14px; /* 增大圆角 */
  background: ${({ selected, theme }) => 
    selected ? 'rgba(255, 255, 255, 0.2)' : `${theme.colors.primary}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem; /* 增大底部间距 */
  color: ${({ selected, theme }) => 
    selected ? theme.colors.white : theme.colors.primary};
  transition: all 0.3s ease;
`;

const PersonaName = styled.h4<{ selected: boolean }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.1rem; /* 增大字体 */
  font-weight: 600;
  color: ${({ selected, theme }) => 
    selected ? theme.colors.white : theme.colors.text};
  margin: 0; /* 移除margin */
  transition: color 0.3s ease;
  line-height: 1.2;
`;

// 添加选中提示区域的样式组件
const SelectionFeedback = styled(motion.div)`
  margin-top: 2rem;
  text-align: center;
  min-height: 80px; /* 确保有足够的空间 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SelectionTitle = styled(motion.h4)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
`;

const SelectionDescription = styled(motion.p)`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text}CC;
  margin: 0;
  max-width: 400px;
`;
const PersonaDescription = styled.p<{ selected: boolean }>`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.85rem; /* 增大字体 */
  line-height: 1.4; /* 增大行高 */
  color: ${({ selected, theme }) => 
    selected ? 'rgba(255, 255, 255, 0.8)' : `${theme.colors.text}99`};
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SelectionIndicator = styled(motion.div)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: 0.7rem;
`;

const ScrollButton = styled(motion.button)<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ direction }) => direction}: 0.5rem;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  color: ${({ theme }) => theme.colors.primary};
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    transform: translateY(-50%) scale(1.05);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
    transition: all 0.1s ease;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(249, 181, 114, 0.3);
  }
`;

const ScrollIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const IndicatorDot = styled.div<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary : `${theme.colors.primary}30`};
  transition: all 0.3s ease;
`;

const ScrollHint = styled(motion.div)`
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text}80;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const personas = [
  {
    id: 'collector',
    name: '收集者',
    description: '像寻宝一样，在过程中发现并整理美好。',
    icon: Search,
    color: '#8B5CF6'
  },
  {
    id: 'competitor',
    name: '竞争者',
    description: '挑战自己，享受全力以赴赢得游戏的感觉。',
    icon: Trophy,
    color: '#F59E0B'
  },
  {
    id: 'explorer',
    name: '探索者',
    description: '保持好奇，把熟悉的环境变成未知的地图。',
    icon: Compass,
    color: '#10B981'
  },
  {
    id: 'creator',
    name: '创造者',
    description: '从无到有，把你的想法变成现实的杰作。',
    icon: Lightbulb,
    color: '#F97316'
  },
  {
    id: 'storyteller',
    name: '故事讲述者',
    description: '赋予行动意义，把它编织成一个精彩的故事。',
    icon: BookOpen,
    color: '#8B5CF6'
  },
  {
    id: 'comedian',
    name: '搞笑者',
    description: '寻找笑点，用幽默感化解一切沉闷。',
    icon: Smile,
    color: '#EC4899'
  },
  {
    id: 'leader',
    name: '领导者',
    description: '运筹帷幄，像将军一样规划并执行你的蓝图。',
    icon: Crown,
    color: '#6366F1'
  },
  {
    id: 'mover',
    name: '运动者',
    description: '感受身体的韵律，让行动充满活力与节奏。',
    icon: Zap,
    color: '#EF4444'
  }
];

interface PersonaSelectorProps {
  selected: string | null;
  onSelect: (persona: string) => void;
}

export function PersonaSelector({ selected, onSelect }: PersonaSelectorProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_hoveredId, setHoveredId] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    setScrollPosition(scrollLeft / maxScroll);
    
    // 用户开始滚动后隐藏提示
    if (showScrollHint && scrollLeft > 0) {
      setShowScrollHint(false);
    }
  };

  const scrollTo = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const cardWidth = 140 + 24; // 更新卡片宽度 + gap (140px + 1.5rem)
    const scrollAmount = cardWidth * 2; // 每次滚动2个卡片的距离
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
    
    // 隐藏滚动提示
    if (showScrollHint) {
      setShowScrollHint(false);
    }
  };

  // 计算当前显示的指示器
  const totalDots = Math.ceil(personas.length / 3);
  const currentDot = Math.floor(scrollPosition * (totalDots - 1));

  return (
    <SelectorContainer>
      <SelectorTitle>
        选择一个让你感到有趣的角色
      </SelectorTitle>
      
      <ScrollContainer>
        <ScrollButton
          direction="left"
          onClick={() => scrollTo('left')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} />
        </ScrollButton>
        
        <ScrollButton
          direction="right"
          onClick={() => scrollTo('right')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} />
        </ScrollButton>
        
        <PersonaGrid ref={scrollRef} onScroll={handleScroll}>
          {personas.map((persona) => {
            const IconComponent = persona.icon;
            const isSelected = selected === persona.id;
            
            return (
              <PersonaCard
                key={persona.id}
                selected={isSelected}
                onClick={() => onSelect(persona.id)}
                onHoverStart={() => setHoveredId(persona.id)}
                onHoverEnd={() => setHoveredId(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3,
                  delay: personas.indexOf(persona) * 0.05
                }}
                whileHover={{ 
                  y: -4,
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { duration: 0.1 }
                }}
              >
                {isSelected && (
                  <SelectionIndicator
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 25 
                    }}
                  >
                    ✓
                  </SelectionIndicator>
                )}
                
                <PersonaIcon selected={isSelected}>
                  <IconComponent size={32} /> {/* 增大图标尺寸到32px */}
                </PersonaIcon>
                
                <PersonaName selected={isSelected}>
                  {persona.name}
                </PersonaName>
                
                {/* 移除PersonaDescription */}
              </PersonaCard>
            );
          })}
        </PersonaGrid>
      </ScrollContainer>

      <ScrollIndicator>
        {Array.from({ length: totalDots }, (_, index) => (
          <IndicatorDot key={index} $active={index === currentDot} />
        ))}
      </ScrollIndicator>
      
      {/* 添加选中提示区域 */}
      {selected && (
        <SelectionFeedback
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <SelectionTitle
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            您选择了{personas.find(p => p.id === selected)?.name}
          </SelectionTitle>
          <SelectionDescription
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {personas.find(p => p.id === selected)?.description}
          </SelectionDescription>
        </SelectionFeedback>
      )}
      
      {showScrollHint && (
        <ScrollHint
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: 1 }}
        >
          ← 滑动查看更多角色 →
        </ScrollHint>
      )}
    </SelectorContainer>
  );
}