'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Heart, Calendar, User, Sparkles, BookOpen, ArrowLeft } from 'lucide-react';
import { Button, Input, Card } from '@/components/atoms';
import { useExperienceStore } from '@/store/experienceStore';
import { useRouter } from 'next/navigation';

const PlaybookContainer = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background} 0%, #F8F5F0 100%);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const BackButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text}80;
  border: 1px solid ${({ theme }) => theme.colors.neutral};
  
  &:hover {
    background: ${({ theme }) => theme.colors.neutral}20;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text}99;
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
`;

const Controls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  min-width: 300px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-width: 100%;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text}60;
  width: 20px;
  height: 20px;
  z-index: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} 0 ${({ theme }) => theme.spacing.md} 56px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  border: none;
  outline: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral};
  caret-color: ${({ theme }) => theme.colors.text};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text}60;
  }
  
  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterButton = styled(Button)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary : 'transparent'
  };
  color: ${({ $active, theme }) => 
    $active ? theme.colors.white : theme.colors.text
  };
  border: 1px solid ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.neutral
  };
  
  &:hover {
    background: ${({ $active, theme }) => 
      $active ? theme.colors.primary : theme.colors.neutral + '20'
    };
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.white} 0%, #F8F5F0 100%);
`;

const StatNumber = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text}80;
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const CategorySection = styled.div``;

const CategoryHeader = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ $color }) => $color}20;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border-left: 4px solid ${({ $color }) => $color};
`;

const CategoryTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CategoryIcon = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 18px;
    height: 18px;
    color: white;
  }
`;

const ExperienceGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ExperienceCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.neutral}40;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transform: translateY(-2px);
  }
`;

const ExperienceHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ExperienceTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  flex: 1;
`;

const FavoriteButton = styled.button<{ $isFavorite: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ $isFavorite, theme }) => 
    $isFavorite ? '#FF6B6B' : theme.colors.text + '40'
  };
  
  &:hover {
    color: #FF6B6B;
  }
`;

const ExperiencePersona = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ExperienceEmotion = styled.div`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ExperienceReflection = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text}80;
  line-height: 1.5;
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const ExperienceDate = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text}60;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text}60;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text}80;
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const EmptyDescription = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  color: ${({ theme }) => theme.colors.text}60;
  margin: 0;
`;

interface Experience {
  id: string;
  title: string;
  persona: string;
  emotion: string;
  emotionPolarity?: 'positive' | 'negative' | 'neutral';
  emotionKeywords: string[];
  reflection: string;
  createdAt: Date;
  isFavorite?: boolean;
}

// 情绪值到表情符号的映射
const emotionMap: Record<string, string> = {
  happy: '😊',
  calm: '😌',
  thoughtful: '🤔',
  amused: '😅',
  bored: '😴',
  anxious: '😰',
  frustrated: '😤',
  mixed: '🙃'
};

const Playbook: React.FC = () => {
  const router = useRouter();
  const { loggedExperiences, refreshLoggedExperiences } = useExperienceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'positive' | 'negative' | 'favorites'>('all');
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    refreshLoggedExperiences();
  }, [refreshLoggedExperiences]);

  // Transform logged experiences to playbook format
  const transformedExperiences = React.useMemo(() => {
    if (!loggedExperiences) return [];
    
    return loggedExperiences.map(exp => ({
      id: exp.id?.toString() || '',
      title: exp.title,
      persona: exp.design?.persona || '未设定',
      emotion: exp.log?.emotion || '未记录',
      emotionPolarity: exp.log?.emotionPolarity,
      emotionKeywords: [],
      reflection: exp.log?.reflection || '',
      createdAt: exp.createdAt,
      isFavorite: false
    }));
  }, [loggedExperiences]);

  useEffect(() => {
    setExperiences(transformedExperiences);
  }, [transformedExperiences]);

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.reflection.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filterType) {
      case 'positive':
        return exp.emotionPolarity === 'positive';
      case 'negative':
        return exp.emotionPolarity === 'negative';
      case 'favorites':
        return exp.isFavorite;
      default:
        return true;
    }
  });

  const positiveExperiences = filteredExperiences.filter(exp => 
    exp.emotionPolarity === 'positive'
  );
  
  const negativeExperiences = filteredExperiences.filter(exp => 
    exp.emotionPolarity === 'negative' || exp.emotionPolarity === 'neutral'
  );

  const toggleFavorite = (id: string) => {
    setExperiences(prev => prev.map(exp => 
      exp.id === id ? { ...exp, isFavorite: !exp.isFavorite } : exp
    ));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderExperienceCard = (experience: Experience) => (
    <ExperienceCard
      key={experience.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <ExperienceHeader>
        <ExperienceTitle>
          {experience.title} {emotionMap[experience.emotion] || ''}
        </ExperienceTitle>
        <FavoriteButton
          $isFavorite={experience.isFavorite || false}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(experience.id);
          }}
        >
          <Heart size={16} fill={experience.isFavorite ? 'currentColor' : 'none'} />
        </FavoriteButton>
      </ExperienceHeader>
      
      <ExperiencePersona>
        <User size={12} />
        {experience.persona}
      </ExperiencePersona>
      
      {experience.reflection && (
        <ExperienceReflection>
          {experience.reflection.length > 100 
            ? `${experience.reflection.substring(0, 100)}...` 
            : experience.reflection
          }
        </ExperienceReflection>
      )}
      
      <ExperienceDate>
        <Calendar size={12} />
        {formatDate(experience.createdAt)}
      </ExperienceDate>
    </ExperienceCard>
  );

  return (
    <PlaybookContainer>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => router.push('/')}>
            <ArrowLeft size={20} />
          </BackButton>
          <div>
            <Title>
              <BookOpen size={32} />
              我的游玩手册
            </Title>
            <Subtitle>回顾并复用你的轻盈瞬间</Subtitle>
          </div>
        </HeaderLeft>
        
        <Controls>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              placeholder="搜索体验、人格或反思..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          <FilterButton
            $active={filterType === 'all'}
            onClick={() => setFilterType('all')}
          >
            全部
          </FilterButton>
          
          <FilterButton
            $active={filterType === 'positive'}
            onClick={() => setFilterType('positive')}
          >
            成功秘笈
          </FilterButton>
          
          <FilterButton
            $active={filterType === 'negative'}
            onClick={() => setFilterType('negative')}
          >
            数据点
          </FilterButton>
          
          <FilterButton
            $active={filterType === 'favorites'}
            onClick={() => setFilterType('favorites')}
          >
            <Heart size={16} />
            收藏
          </FilterButton>
        </Controls>
      </Header>

      <StatsSection>
        <StatCard>
          <StatNumber>{experiences.length}</StatNumber>
          <StatLabel>总体验数</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{positiveExperiences.length}</StatNumber>
          <StatLabel>成功秘笈</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{negativeExperiences.length}</StatNumber>
          <StatLabel>数据点</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{experiences.filter(exp => exp.isFavorite).length}</StatNumber>
          <StatLabel>收藏数</StatLabel>
        </StatCard>
      </StatsSection>

      {experiences.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📚</EmptyIcon>
          <EmptyTitle>还没有游玩记录</EmptyTitle>
          <EmptyDescription>
            完成一些体验并记录感受后，这里会显示你的轻盈瞬间集合
          </EmptyDescription>
        </EmptyState>
      ) : (
        <ContentSection>
          <CategorySection>
            <CategoryHeader $color="#FF8C42">
              <CategoryIcon $color="#FF8C42">
                <Sparkles />
              </CategoryIcon>
              <CategoryTitle>成功秘笈 ({positiveExperiences.length})</CategoryTitle>
            </CategoryHeader>
            <ExperienceGrid>
              <AnimatePresence>
                {positiveExperiences.length === 0 ? (
                  <EmptyState>
                    <EmptyDescription>暂无正向体验记录</EmptyDescription>
                  </EmptyState>
                ) : (
                  positiveExperiences.map(renderExperienceCard)
                )}
              </AnimatePresence>
            </ExperienceGrid>
          </CategorySection>

          <CategorySection>
            <CategoryHeader $color="#4ECDC4">
              <CategoryIcon $color="#4ECDC4">
                <Filter />
              </CategoryIcon>
              <CategoryTitle>数据点 ({negativeExperiences.length})</CategoryTitle>
            </CategoryHeader>
            <ExperienceGrid>
              <AnimatePresence>
                {negativeExperiences.length === 0 ? (
                  <EmptyState>
                    <EmptyDescription>暂无负向体验记录</EmptyDescription>
                  </EmptyState>
                ) : (
                  negativeExperiences.map(renderExperienceCard)
                )}
              </AnimatePresence>
            </ExperienceGrid>
          </CategorySection>
        </ContentSection>
      )}
    </PlaybookContainer>
  );
};

export default Playbook;