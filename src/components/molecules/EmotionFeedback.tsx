'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

interface EmotionFeedbackProps {
  onEmotionSelect: (emotion: string, polarity: 'positive' | 'negative' | 'neutral') => void;
  selectedEmotion?: string;
  showFollowUp?: boolean;
  onFollowUpAnswer?: (answer: string) => void;
  followUpAnswer?: string;
}

const Container = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  font-weight: 500;
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

const KeywordSection = styled(motion.div)`
  margin-bottom: 1.5rem;
`;

const KeywordGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const KeywordTag = styled(motion.button)<{ $selected: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme, $selected }) => 
    $selected ? theme.colors.accentGreen : theme.colors.neutral
  };
  border-radius: 20px;
  background: ${({ theme, $selected }) => 
    $selected ? `${theme.colors.accentGreen}20` : 'white'
  };
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.accentGreen};
    background: ${({ theme }) => `${theme.colors.accentGreen}10`};
  }
`;

const FollowUpSection = styled(motion.div)`
  margin-top: 1.5rem;
`;

const FollowUpQuestion = styled.h4`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  font-weight: 500;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
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

const emotions = [
  { emoji: '😊', label: '开心', value: 'happy', polarity: 'positive' as const },
  { emoji: '😌', label: '平静', value: 'calm', polarity: 'positive' as const },
  { emoji: '🤔', label: '思考', value: 'thoughtful', polarity: 'neutral' as const },
  { emoji: '😅', label: '有趣', value: 'amused', polarity: 'positive' as const },
  { emoji: '😴', label: '无聊', value: 'bored', polarity: 'negative' as const },
  { emoji: '😰', label: '焦虑', value: 'anxious', polarity: 'negative' as const },
  { emoji: '😤', label: '沮丧', value: 'frustrated', polarity: 'negative' as const },
  { emoji: '🙃', label: '复杂', value: 'mixed', polarity: 'neutral' as const },
];

const emotionKeywords = {
  positive: ['轻松', '有成就感', '充实', '愉快', '满足', '兴奋'],
  negative: ['困难', '压力大', '无聊', '挫败', '疲惫', '焦虑'],
  neutral: ['平常', '还好', '一般', '复杂', '混合', '说不清']
};

export function EmotionFeedback({
  onEmotionSelect,
  selectedEmotion,
  showFollowUp = true,
  onFollowUpAnswer,
  followUpAnswer = ''
}: EmotionFeedbackProps) {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [followUpText, setFollowUpText] = useState(followUpAnswer);

  const handleEmotionSelect = (emotion: typeof emotions[0]) => {
    onEmotionSelect(emotion.value, emotion.polarity);
    setSelectedKeywords([]); // Reset keywords when emotion changes
  };

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const handleFollowUpChange = (text: string) => {
    setFollowUpText(text);
    onFollowUpAnswer?.(text);
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

  const getCurrentKeywords = () => {
    if (!selectedEmotion) return [];
    
    const emotion = emotions.find(e => e.value === selectedEmotion);
    if (!emotion) return [];
    
    return emotionKeywords[emotion.polarity];
  };

  return (
    <Container>
      <SectionTitle>选择一个最贴近的情绪</SectionTitle>
      
      <EmotionGrid>
        {emotions.map((emotion) => (
          <EmotionButton
            key={emotion.value}
            $selected={selectedEmotion === emotion.value}
            onClick={() => handleEmotionSelect(emotion)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <EmotionEmoji>{emotion.emoji}</EmotionEmoji>
            <EmotionLabel>{emotion.label}</EmotionLabel>
          </EmotionButton>
        ))}
      </EmotionGrid>

      <AnimatePresence>
        {selectedEmotion && (
          <KeywordSection
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionTitle>选择相关的关键词（可选）</SectionTitle>
            <KeywordGrid>
              {getCurrentKeywords().map((keyword) => (
                <KeywordTag
                  key={keyword}
                  $selected={selectedKeywords.includes(keyword)}
                  onClick={() => handleKeywordToggle(keyword)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {keyword}
                </KeywordTag>
              ))}
            </KeywordGrid>
          </KeywordSection>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEmotion && showFollowUp && (
          <FollowUpSection
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FollowUpQuestion>{getFollowUpQuestion()}</FollowUpQuestion>
            <TextArea
              value={followUpText}
              onChange={(e) => handleFollowUpChange(e.target.value)}
              placeholder="分享你的想法..."
            />
          </FollowUpSection>
        )}
      </AnimatePresence>
    </Container>
  );
}