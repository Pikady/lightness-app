'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Lightbulb,
  Wand2
} from 'lucide-react';

const GeneratorContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const GeneratorTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 1.5rem;
  opacity: 0.8;
`;

const AISection = styled.div`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}08 0%, 
    ${({ theme }) => theme.colors.accentGreen}05 100%
  );
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.03) 50%, 
      transparent 100%
    );
    pointer-events: none;
  }
`;

const AIHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const AIIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const AITitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const GenerateButton = styled(motion.button)<{ $loading: boolean }>`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: ${({ $loading }) => $loading ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: ${({ $loading }) => $loading ? 0.7 : 1};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`;

const SuggestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const SuggestionItem = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.primary}15;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}40;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const SuggestionText = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const AddButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}25;
    transform: scale(1.1);
  }
`;

const ManualSection = styled.div`
  margin-top: 2rem;
`;

const ManualTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const QuestItem = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral};
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuestInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text}60;
  }
`;

const DeleteButton = styled(motion.button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.text}60;
  border: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}15;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AddQuestButton = styled(motion.button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 2px dashed ${({ theme }) => theme.colors.primary}40;
  border-radius: 12px;
  padding: 1rem;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary}05;
  }
`;

const ErrorMessage = styled(motion.div)`
  background: ${({ theme }) => theme.colors.primary}10;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  text-align: center;
`;

interface SideQuest {
  id: string;
  text: string;
}

interface SideQuestGeneratorProps {
  quests: SideQuest[];
  onQuestsChange: (quests: SideQuest[]) => void;
  taskDescription?: string;
  selectedPersona?: string;
}

export function SideQuestGenerator({ 
  quests, 
  onQuestsChange, 
  taskDescription,
  selectedPersona 
}: SideQuestGeneratorProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = async () => {
    if (!taskDescription || !selectedPersona) {
      setError('请先完成前面的步骤');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: taskDescription,
          persona: selectedPersona,
        }),
      });

      if (!response.ok) {
        throw new Error('AI服务暂时不可用');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      // 非评判性错误处理 - 静默回退到手动输入
      console.warn('AI suggestions failed:', err);
      setSuggestions([
        '为这个任务设定一个有趣的背景故事',
        '添加一个小小的仪式感',
        '准备一个庆祝完成的方式',
        '邀请朋友一起参与',
        '记录过程中的有趣瞬间'
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const addSuggestion = (suggestion: string) => {
    const newQuest: SideQuest = {
      id: Date.now().toString(),
      text: suggestion
    };
    onQuestsChange([...quests, newQuest]);
  };

  const addManualQuest = () => {
    const newQuest: SideQuest = {
      id: Date.now().toString(),
      text: ''
    };
    onQuestsChange([...quests, newQuest]);
  };

  const updateQuest = (id: string, text: string) => {
    const updatedQuests = quests.map(quest =>
      quest.id === id ? { ...quest, text } : quest
    );
    onQuestsChange(updatedQuests);
  };

  const deleteQuest = (id: string) => {
    const updatedQuests = quests.filter(quest => quest.id !== id);
    onQuestsChange(updatedQuests);
  };

  return (
    <GeneratorContainer>
      <GeneratorTitle>
        添加一些支线任务，让过程更有趣
      </GeneratorTitle>

      <AISection>
        <AIHeader>
          <AIIcon>
            <Wand2 size={18} />
          </AIIcon>
          <AITitle>AI 灵感助手</AITitle>
        </AIHeader>

        <GenerateButton
          $loading={isLoading}
          onClick={generateSuggestions}
          disabled={isLoading || !taskDescription || !selectedPersona}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              获取灵感
            </>
          )}
        </GenerateButton>

        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </ErrorMessage>
        )}

        <AnimatePresence>
          {suggestions.length > 0 && (
            <SuggestionsList>
              {suggestions.map((suggestion, index) => (
                <SuggestionItem
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => addSuggestion(suggestion)}
                >
                  <SuggestionText>{suggestion}</SuggestionText>
                  <AddButton
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus size={16} />
                  </AddButton>
                </SuggestionItem>
              ))}
            </SuggestionsList>
          )}
        </AnimatePresence>
      </AISection>

      <ManualSection>
        <ManualTitle>
          <Lightbulb size={18} />
          我的支线任务
        </ManualTitle>

        <QuestsList>
          <AnimatePresence>
            {quests.map((quest) => (
              <QuestItem
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
              >
                <QuestInput
                  value={quest.text}
                  onChange={(e) => updateQuest(quest.id, e.target.value)}
                  placeholder="输入一个让任务更有趣的想法..."
                />
                <DeleteButton
                  onClick={() => deleteQuest(quest.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 size={14} />
                </DeleteButton>
              </QuestItem>
            ))}
          </AnimatePresence>

          <AddQuestButton
            onClick={addManualQuest}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} />
            添加支线任务
          </AddQuestButton>
        </QuestsList>
      </ManualSection>
    </GeneratorContainer>
  );
}