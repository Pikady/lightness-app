'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/atoms';
import { ArrowLeft, BookOpen } from 'lucide-react';

const LogContainer = styled(motion.div)`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  position: relative;
`;

const Header = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled(Button)`
  padding: 0.5rem;
`;

const CompleteButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
`;

const DiaryContainer = styled(motion.div)`
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  margin-top: 4rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 3rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${({ theme }) => theme.colors.primary};
    opacity: 0.3;
  }
`;

const DiaryTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.handwriting};
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
`;

const TaskReference = styled.div`
  background: ${({ theme }) => theme.colors.neutral}20;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-left: 4px solid ${({ theme }) => theme.colors.accentGreen};
`;

const TaskTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const TaskMeta = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
`;

const QuestionSection = styled.div`
  margin-bottom: 2rem;
`;

const Question = styled.h2`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.neutral};
  border-radius: 8px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background: white;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accentGreen};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text};
    opacity: 0.5;
  }
`;

const EmotionSection = styled.div`
  margin-bottom: 2rem;
`;

const EmotionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const EmotionButton = styled(motion.button)<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid ${({ theme, $selected }) => 
    $selected ? theme.colors.accentGreen : theme.colors.neutral
  };
  border-radius: 12px;
  background: ${({ theme, $selected }) => 
    $selected ? `${theme.colors.accentGreen}20` : 'white'
  };
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.accentGreen};
    background: ${({ theme }) => `${theme.colors.accentGreen}10`};
  }
`;

const EmotionEmoji = styled.div`
  font-size: 2rem;
`;

const EmotionLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const FollowUpSection = styled(motion.div)`
  margin-bottom: 2rem;
`;

const FollowUpQuestion = styled.h3`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const emotions = [
  { emoji: '😊', label: '开心', value: 'happy', polarity: 'positive' },
  { emoji: '😌', label: '平静', value: 'calm', polarity: 'positive' },
  { emoji: '🤔', label: '思考', value: 'thoughtful', polarity: 'neutral' },
  { emoji: '😅', label: '有趣', value: 'amused', polarity: 'positive' },
  { emoji: '😴', label: '无聊', value: 'bored', polarity: 'negative' },
  { emoji: '😰', label: '焦虑', value: 'anxious', polarity: 'negative' },
  { emoji: '😤', label: '沮丧', value: 'frustrated', polarity: 'negative' },
  { emoji: '🙃', label: '复杂', value: 'mixed', polarity: 'neutral' },
];

export default function LogPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  
  const [reflection, setReflection] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState('');

  const experience = useLiveQuery(
    () => db.experiences.get(id),
    [id]
  );

  useEffect(() => {
    if (experience) {
      if (experience.status !== 'played') {
        // 使用 replace 而不是 push 避免导航堆栈问题
        router.replace('/');
      }
    }
  }, [experience, router]);

  const handleBack = () => {
    router.back();
  };

  const handleComplete = async () => {
    if (experience && selectedEmotion) {
      const selectedEmotionData = emotions.find(e => e.value === selectedEmotion);
      
      await db.experiences.update(id, {
        status: 'logged',
        loggedAt: new Date(),
        log: {
          reflection,
          emotion: selectedEmotion,
          emotionPolarity: (selectedEmotionData?.polarity || 'neutral') as 'positive' | 'negative' | 'neutral',
          followUpAnswer,
          loggedAt: new Date()
        }
      });
      
      router.push('/');
    }
  };

  const getFollowUpQuestion = () => {
    if (!selectedEmotion) return null;
    
    const emotion = emotions.find(e => e.value === selectedEmotion);
    if (!emotion) return null;
    
    switch (emotion.polarity) {
      case 'positive':
        return '是什么让它变得有趣？';
      case 'negative':
        return '太好了，我们收集到新的数据点。这次实验告诉了你什么？';
      default:
        return '这个过程中有什么特别的发现吗？';
    }
  };

  if (!experience) {
    return null;
  }

  return (
    <LogContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header>
        <BackButton
          variant="secondary"
          onClick={handleBack}
        >
          <ArrowLeft size={20} />
        </BackButton>
      </Header>

      <DiaryContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <DiaryTitle>体验日志</DiaryTitle>
        
        <TaskReference>
          <TaskTitle>{experience.title}</TaskTitle>
          <TaskMeta>
            游玩角色：{experience.design?.persona || '未设定'} • 
            完成时间：{new Date().toLocaleDateString()}
          </TaskMeta>
        </TaskReference>

        <QuestionSection>
          <Question>这个过程感觉如何？</Question>
          <TextArea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="写下你的感受和想法..."
          />
        </QuestionSection>

        <EmotionSection>
          <Question>选择一个最贴近的情绪</Question>
          <EmotionGrid>
            {emotions.map((emotion) => (
              <EmotionButton
                key={emotion.value}
                $selected={selectedEmotion === emotion.value}
                onClick={() => setSelectedEmotion(emotion.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <EmotionEmoji>{emotion.emoji}</EmotionEmoji>
                <EmotionLabel>{emotion.label}</EmotionLabel>
              </EmotionButton>
            ))}
          </EmotionGrid>
        </EmotionSection>

        {selectedEmotion && (
          <FollowUpSection
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
          >
            <FollowUpQuestion>{getFollowUpQuestion()}</FollowUpQuestion>
            <TextArea
              value={followUpAnswer}
              onChange={(e) => setFollowUpAnswer(e.target.value)}
              placeholder="分享你的想法..."
              style={{ minHeight: '80px' }}
            />
          </FollowUpSection>
        )}

        <ActionButtons>
           <CompleteButton
             onClick={handleComplete}
             disabled={!reflection.trim() || !selectedEmotion}
           >
             <BookOpen size={18} />
             完成记录
           </CompleteButton>
         </ActionButtons>
      </DiaryContainer>
    </LogContainer>
  );
}